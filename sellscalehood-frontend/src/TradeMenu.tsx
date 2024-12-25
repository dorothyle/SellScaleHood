import React, { FC, useState, FormEvent } from "react";
import PreviewOrder from "./PreviewOrder.tsx";
import { Order } from "./order.ts";
import "./styling/TradeMenu.css";

const TradeMenu: FC = ({ setDisplayTradeMenu }) => {
  const user_id = 1;
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [order, setOrder] = useState<Order>({
    stock_symbol: null,
    purchase_type: null,
    share_count: 0,
    price: null,
    user_id: 1,
  });
  const [stockSymbol, setStockSymbol] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [purchaseType, setPurchaseType] = useState<string>("");
  const [shareCount, setShareCount] = useState<number>(0);
  const [sharePrice, setSharePrice] = useState<number | null>(null);
  const [previewingOrder, setPreviewingOrder] = useState<boolean>(false);

  const searchForStock = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const url = "http://127.0.0.1:5000/search_stock?symbol=" + searchInput;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
        setStockSymbol(data.stock_symbol);
        setSharePrice(data.current_price);
        setCompanyName(data.company_name);
      } else {
        setSearchResult({ error: response.statusText })
        console.error("API ERROR:", response.statusText);
      }
    } catch (error) {
      setSearchResult({ error: "An unexpected error occurred." })
      console.error("Request failed:", error);
    }
  };

  const submitOrder = async () => {
    try {
      const url = "http://127.0.0.1:5000/create_order";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Order placed.");
        clearOrder();
        window.location.reload();
      } else {
        console.error("API ERROR:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const isValidOrder = () => {
    return (
      stockSymbol !== null &&
      purchaseType !== null &&
      shareCount !== null &&
      shareCount > 0 &&
      sharePrice !== null &&
      user_id !== null
    );
  };

  const triggerPreviewOrder = () => {
    if (isValidOrder()) {
      setPreviewingOrder(true);
      setOrder({
        stock_symbol: stockSymbol,
        purchase_type: purchaseType,
        share_count: shareCount,
        price: sharePrice,
        user_id: user_id,
      });
    } else {
      setPreviewingOrder(false);
      setOrder({
        stock_symbol: null,
        purchase_type: null,
        share_count: 0,
        price: null,
        user_id: 1,
      });
      alert("Invalid order. Please fill out all fields.");
    }
  };

  const clearOrder = () => {
    setStockSymbol(null);
    setCompanyName(null);
    setPurchaseType(null);
    setShareCount(0);
    setSharePrice(null);
    setOrder({
      stock_symbol: null,
      purchase_type: null,
      share_count: 0,
      price: null,
      user_id: 1,
    });
    setPreviewingOrder(false);
  };

  return (
    <div className="tradeMenuContainer">
      <p className="closeMenu" onClick={() => setDisplayTradeMenu(false)}>X</p>
      <h2>Trade</h2>
      {/* Look up stock to trade */}
      <form className="searchStockForm" onSubmit={searchForStock}>
        <label>
          <input
            className="stockInput"
            placeholder="Enter stock symbol"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </label>
        <button className="searchButton" type="submit">
          Search
        </button>
      </form>

      {/* Render search results */}
      {searchResult && !searchResult.error && (
        <div className="stockInfo">
          <p className="companyName">{searchResult.company_name}</p>
          <div className="stockStats">
            <p className="price">${searchResult.current_price}</p>
            <p
              className={`percentageChange ${
                searchResult.daily_percentage_change >= 0
                  ? "positive"
                  : "negative"
              }`}
            >
              {searchResult.daily_percentage_change >= 0 ? "+" : ""}
              {searchResult.daily_percentage_change}%
            </p>
          </div>
        </div>
      )}

      {searchResult && searchResult.error && (
        <div>
          <p>Stock not found</p>
        </div>
      )}

      {/* Buy or sell buttons */}
      <div className="purchaseButtons">
        <button
          className={`buyButton ${
            purchaseType === "BUY" ? "selected" : "notSelected"
          }`}
          onClick={() => setPurchaseType("BUY")}
        >
          Buy
        </button>
        <button
          className={`sellButton ${
            purchaseType === "SELL" ? "selected" : "notSelected"
          }`}
          onClick={() => setPurchaseType("SELL")}
        >
          Sell
        </button>
      </div>
      {/* Share amount */}
      <form>
        <label className="shareAmountForm">
          <p>Share amount</p>
          <input
            className="shareAmountInput"
            type="number"
            value={shareCount}
            onChange={(e) => setShareCount(e.target.value)}
          />
        </label>
      </form>

      {/* Preview order button */}
      <button className="orderButtons" onClick={triggerPreviewOrder}>Preview Order</button>

      {previewingOrder && (
        <div className="previewOrderDetails">
          <PreviewOrder
            stock_symbol={stockSymbol}
            company_name={companyName}
            purchase_type={purchaseType}
            share_count={shareCount}
            price={sharePrice}
            user_id={user_id}
          />
          <button className="orderButtons" onClick={submitOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default TradeMenu;
