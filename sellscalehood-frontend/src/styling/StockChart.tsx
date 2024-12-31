import React, { useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Filler );

interface StockData {
    close: number;
    date: Date;
}

const StockChart = ({ symbol }) => {
    const [historyData, setHistoryData] = useState<StockData[]>(null)
    const getHistory = async () => {
        // const symbol = 'aapl';
        try {
            const url = "http://127.0.0.1:5000/historical_data?stock_symbol=" + symbol;
            const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });

            if (response.ok) {
                const data = await response.json();
                const formattedData = data.map((item) => ({
                    close: item.Close,
                    date: item.Date,
                }))
                console.log(data);
                console.log(formattedData);
                setHistoryData(formattedData);
            } else {
                setHistoryData({ error: response.statusText })
                console.error("API ERROR:", response.statusText);
            }
        } catch (error) {
            setHistoryData({ error: "An unexpected error occurred." })
            console.error("Request failed:", error);
        }
    };
    
    return (
        <div>
            <button onClick={getHistory}>Get stock history</button>
            {historyData && historyData.map((item) => (
                <p>{item.close} {item.date}</p>
            ))}
            {historyData &&
            <Line 
            data = {{
                labels: historyData.map((item) => item.date),
                datasets: [
                    {
                        label: 'Stock Price',
                        data: historyData.map((item) => item.close),
                        fill: true,
                        borderColor: '#fb26ff',
                        backgroundColor: '#ab1aad',
                        borderWidth: 2,
                        tension: 0.4,
                    }
                ]
            }}
            />}
            {historyData === null && <p>NULL</p>}
        </div>
    );
};

export default StockChart;