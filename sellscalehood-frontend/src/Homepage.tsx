import React, {useState, useEffect} from "react";
import TradeMenu from "./TradeMenu.tsx";
import Portfolio from "./Portfolio.tsx";
import "./styling/Homepage.css";
import StockChart from "./StockChart.tsx";

const Homepage = () => {
  const [displayTradeMenu, setDisplayTradeMenu] = useState<Boolean>(false);
  const [inputStock, setInputStock] = useState<String>('');

  useEffect(() => {
    // Function to handle screen width check
    const handleResize = () => {
      if (window.innerWidth > 800) { // Set your threshold here, e.g., 768px
        setDisplayTradeMenu(true);
      } else {
        setDisplayTradeMenu(false);
      }
    };

    // Check screen width initially
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="homepageContainer">
      <h1>Hi, Emma</h1>
      <label>
        <input
          value={inputStock}
          onChange={(e) => setInputStock(e.target.value)} />
      </label>
      <StockChart symbol={inputStock} />
      <div className="contentContainer">
        <Portfolio setDisplayTradeMenu={setDisplayTradeMenu}/>
        {displayTradeMenu && <TradeMenu displayTradeMenu={displayTradeMenu} setDisplayTradeMenu={setDisplayTradeMenu} />}
      </div>
    </div>
  );
};

export default Homepage;
