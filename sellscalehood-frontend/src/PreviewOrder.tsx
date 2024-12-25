import React, { FC } from "react";

interface PreviewOrderProps {
    stock_symbol: string;
    company_name: string;
    purchase_type: string;
    share_count: number;
    price: number;
    user_id: string;
}

const PreviewOrder: FC<PreviewOrderProps> = ({ stock_symbol, company_name, purchase_type, share_count, price, user_id }) => {
  return (
    <div>
      <p>Stock: {stock_symbol}</p>
      <p>Company: {company_name}</p>
      <p>Action: {purchase_type}</p>
      <p>Number of shares: {share_count}</p>
      <p>Total price: {price * share_count}</p>
    </div>
  );
};

export default PreviewOrder;
