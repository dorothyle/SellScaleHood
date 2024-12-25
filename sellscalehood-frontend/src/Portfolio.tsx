import React, { useState, useEffect } from "react";
import Positions from "./Positions.tsx";
import "./styling/Portfolio.css";

const Portfolio = ({setDisplayTradeMenu}) => {
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
    <div className="portfolioContainer">
      <div className="portfolioHeader">
        <div>
          <h3 className="portfolioTitle">Portfolio Balance</h3>
          <h2 className="portfolioBalance">${ portfolioVal === null ? 0.00 : portfolioVal.toFixed(2) }</h2>
        </div>
        <button className="tradeButton" onClick={() => setDisplayTradeMenu(true)}>+</button>
      </div>
      <h3 className="portfolioTitle portfolioPositions">Portfolio Positions</h3>
      <Positions />
    </div>
  );
};

export default Portfolio;
