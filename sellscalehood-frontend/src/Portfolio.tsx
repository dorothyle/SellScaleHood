import React, { useState, useEffect } from "react";
import Positions from "./Positions.tsx";

const Portfolio = () => {
  const user_id = 1;
  const [portfolioVal, setPortfolioVal] = useState<number>(0);
  useEffect(() => {
    // Retrieves total portfolio value
    const fetchData = async () => {
      try {
        const url = "http://127.0.0.1:5000/portfolio_value?user_id=" + user_id;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setPortfolioVal(data.portfolio_value);
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
      <p>Portfolio</p>
      <p>${portfolioVal.toFixed(2)}</p>
      <Positions />
    </div>
  );
};

export default Portfolio;
