import React from 'react';
import SearchStock from './SearchStock.tsx';
import TradeMenu from './TradeMenu.tsx';

const Homepage = () => {
  return (
    <div>
      <p>Hi, this is the homepage</p>
      <SearchStock />
      <TradeMenu />
    </div>
  );
}

export default Homepage;
