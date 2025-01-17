import React, { useState, useEffect } from "react";
import "./styling/OrderHistory.css";

interface OrderData {
  stock: string;
  share_count: number;
  price: number;
  purchase_type: string;
}

const OrderHistory = () => {
  const user_id = 1;
  const [orderHistory, setOrderHistory] = useState<OrderData[]>([]);
  useEffect(() => {
    // Retrieves list of past orders
    const fetchData = async () => {
      try {
        const url = "http://127.0.0.1:5000/order_history?user_id=" + user_id;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrderHistory(data);
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
    <div className="orderHistoryContainer">
      {orderHistory.map((item, index) => (
        <div className="ownedStock" key={index}>
          <div>
            <p className="ownedStockName">{item.stock}</p>
            <p className="ownedStockShares">{item.share_count} shares</p>
          </div>
          <div>
            <p className="ownedStockPrice">${item.price}</p>
            <p className={`orderPurchaseType ${item.purchase_type === "BUY" ? "buyPurchaseType" : "sellPurchaseType"}`}
            >{item.purchase_type}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
