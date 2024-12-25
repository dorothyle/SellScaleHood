import React, {useState} from "react";
import TradeMenu from "./TradeMenu.tsx";
import Portfolio from "./Portfolio.tsx";
import "./styling/Homepage.css";

const Homepage = () => {
  const [displayTradeMenu, setDisplayTradeMenu] = useState<Boolean>(false);
  return (
    <div className="homepageContainer">
      <h1>Hi, Emma</h1>
      <div className="contentContainer">
        <Portfolio setDisplayTradeMenu={setDisplayTradeMenu}/>
        {displayTradeMenu && <TradeMenu />}
      </div>
    </div>
  );
};

export default Homepage;
