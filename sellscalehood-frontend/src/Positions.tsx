import React, { useState, useEffect } from "react";

interface OwnedStockData {
    stock: string,
    share_count: number,
    current_price: number,
    daily_percentage_change: number,
}

const Positions = () => {
  const user_id = 1;
  const [ownedStocks, setOwnedStocks] = useState<OwnedStockData[]>([]);
  useEffect(() => {
    // Retrieves list of owned stocks
    const fetchData = async () => {
      try {
        const url = "http://127.0.0.1:5000/owned_stocks?user_id=" + user_id;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setOwnedStocks(data);
          console.log("List of owned stock:", data);
        } else {
          console.error("API ERROR:", response.statusText);
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <p>Positions here</p>
      {
        ownedStocks.map((item, index) => (
            <div key={index}>
                <p>{item.stock}</p>
                <p>{item.current_price}</p>
                <p>{item.daily_percentage_change}</p>
            </div>
        ))
      }
    </div>
  );
};

export default Positions;