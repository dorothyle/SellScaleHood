import React, { FC, useState, FormEvent } from "react";
import PreviewOrder from "./PreviewOrder.tsx";
import { Order } from "./order.ts";

const TradeMenu: FC = () => {
  const user_id = 1;
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [order, setOrder] = useState<Order>({
    stock_symbol: null,
    purchase_type: null,
    share_count: null,
    price: null,
    user_id: 1,
  });
  const [stockSymbol, setStockSymbol] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [purchaseType, setPurchaseType] = useState<string>("");
  const [shareCount, setShareCount] = useState<number>(0);
  const [sharePrice, setSharePrice] = useState<number | null>(null);
  const [previewingOrder, setPreviewingOrder] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearOrder();
    console.log(searchInput);

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
        setStockSymbol(searchInput);
        setSharePrice(data.current_price);
        setCompanyName(data.company_name);
        console.log("API response:", data);
      } else {
        console.error("API ERROR:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const submitOrder = async () => {
    try {
      const url = "http://127.0.0.1:5000/create_order";
      console.log(order);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
      } else {
        console.error("API ERROR:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  const triggerPreviewOrder = () => {
    setPreviewingOrder(true);
    setOrder({
      stock_symbol: stockSymbol,
      purchase_type: purchaseType,
      share_count: shareCount,
      price: sharePrice,
      user_id: user_id,
    })
  }

  const clearOrder = () => {
    setStockSymbol(null);
    setCompanyName(null);
    setPurchaseType(null);
    setShareCount(0);
    setSharePrice(null);
    setPreviewingOrder(false);
  }

  return (
    <div>
      <p>Buy Menu</p>
      {/* Look up stock to trade */}
      <form onSubmit={handleSubmit}>
        <label>
          Enter Stock:
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {/* Render search results */}
      {searchResult && !searchResult.error && (
        <div className="stockInfo">
          <p>RESPONSE</p>
          <p>Company name: {searchResult.company_name}</p>
          <p>Current price: {searchResult.current_price}</p>
          <p>Percentage change: {searchResult.daily_percentage_change}</p>

          <button>Buy</button>
        </div>
      )}

      {searchResult && searchResult.error && (
        <div>
            <p>ERROR!</p>
        </div>
      )}

      {/* Buy or sell buttons */}
      <div>
        <button onClick={() => setPurchaseType("buy")}>Buy</button>
        <button onClick={() => setPurchaseType("sell")}>Sell</button>
      </div>
      {/* Share amount */}
      <form>
        <label>
          Share amount
          <input
            type="number"
            value={shareCount}
            onChange={(e) => setShareCount(e.target.value)}
          />
        </label>
      </form>

      {/* Preview order button */}
      <button onClick={triggerPreviewOrder}>Preview Order</button>

      {/* TODO: have button direct to preview order page; pass in searched stock and its price */}
      {previewingOrder && (
        <div>
          <PreviewOrder stock_symbol={stockSymbol} company_name={companyName} purchase_type={purchaseType} share_count={shareCount} price={sharePrice} user_id={user_id} />
          <button onClick={ submitOrder }>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default TradeMenu;
