import React, { useState, useEffect } from "react";
import Positions from "./Positions.tsx";
import "./styling/Portfolio.css";
import OrderHistory from "./OrderHistory.tsx";

const Portfolio = ({setDisplayTradeMenu}) => {
  const user_id = 1;
  const [portfolioVal, setPortfolioVal] = useState<number>(0);
  const [stockAnalysis, setStockAnalysis] = useState<String>('');
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

  const getAnalysis = async () => {
    try {
      const url = "http://127.0.0.1:5000/stock_analysis?user_id=" + user_id;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStockAnalysis(data.analysis);
      } else {
        setStockAnalysis({ error: response.statusText })
        console.error("API ERROR:", response.statusText);
      }
    } catch (error) {
      setStockAnalysis({ error: "An unexpected error occurred." })
      console.error("Request failed:", error);
    }
  };
  

  return (
    <div className="portfolioContainer">
      <div className="portfolioHeader">
        <div>
          <h3 className="portfolioTitle">Portfolio Balance</h3>
          <h2 className="portfolioBalance">${ portfolioVal === null ? 0.00 : portfolioVal.toLocaleString("en-us") }</h2>
        </div>
        <button className="tradeButton" onClick={() => setDisplayTradeMenu(true)}>+</button>
      </div>
      <h3 className="portfolioTitle portfolioPositions">Portfolio Positions</h3>
      <button onClick={getAnalysis}>Analyze Portfolio</button>
      <p style={{
        backgroundColor: "white",
      }}>{stockAnalysis}</p>
      <Positions />
      <h3 className="portfolioTitle portfolioPositions">Transaction History</h3>
      <OrderHistory />
    </div>
  );
};

export default Portfolio;
