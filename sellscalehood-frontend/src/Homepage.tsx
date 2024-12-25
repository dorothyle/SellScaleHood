import React from 'react';
import SearchStock from './SearchStock.tsx';
import TradeMenu from './TradeMenu.tsx';
import Positions from './Positions.tsx';

const Homepage = () => {
  return (
    <div>
      <p>Hi, this is the homepage</p>
      {/* <SearchStock /> */}
      <TradeMenu />
      <Positions />
    </div>
  );
}

export default Homepage;
