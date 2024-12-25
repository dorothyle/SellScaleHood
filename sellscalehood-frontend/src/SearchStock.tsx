import React, { FC, useState, FormEvent } from "react";

const SearchStock: FC = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any | null>(null);

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
      <p>Search stock goes here</p>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Text:
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {searchResult && !searchResult.error && (
        <div className="stockInfo">
          <p>RESPONSE</p>
          <p>Company name: {searchResult.company_name}</p>
          <p>Current price: {searchResult.current_price}</p>
          <p>Percentage change: {searchResult.daily_percentage_change}</p>
        </div>
      )}

      {searchResult && searchResult.error && (
        <div>
            <p>ERROR!</p>
        </div>
      )}
    </div>
  );
};

export default SearchStock;
