import React, { FC, useState, FormEvent } from "react";

interface TradeMenuProps {
    stock_symbol: string;
    price: number;
    user_id: string;
}

const TradeMenu: FC<TradeMenuProps> = ({ stock_symbol, price, user_id }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [shareCount, setShareCount] = useState<number>(0);
  const [purchaseType, setPurchaseType] = useState<string>("");

  console.log(purchaseType);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
        console.log("API response:", data);
      } else {
        console.error("API ERROR:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

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
      <button>Preview Order</button>
    </div>
  );
};

export default TradeMenu;
