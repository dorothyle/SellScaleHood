import React from 'react';
import TradeMenu from './TradeMenu.tsx';
import Portfolio from './Portfolio.tsx';

const Homepage = () => {
  return (
    <div>
      <p>Hi, this is the homepage</p>
      <TradeMenu />
      <Portfolio />
    </div>
  );
}

export default Homepage;
