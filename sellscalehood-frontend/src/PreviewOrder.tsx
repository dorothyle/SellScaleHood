import React, { FC } from "react";
import './styling/PreviewOrder.css';

interface PreviewOrderProps {
  stock_symbol: string;
  company_name: string;
  purchase_type: string;
  share_count: number;
  price: number;
  user_id: string;
}

const PreviewOrder: FC<PreviewOrderProps> = ({
  stock_symbol,
  company_name,
  purchase_type,
  share_count,
  price,
  user_id,
}) => {
  return (
    <div className="orderPreviewContainer">
      <div className="orderPreviewRow">
        <p className="rowTitle">Stock</p>
        <p className="rowData">{stock_symbol}</p>
      </div>
      <div className="orderPreviewRow">
        <p className="rowTitle">Company</p>
        <p className="rowData">{company_name}</p>
      </div>
      <div className="orderPreviewRow">
        <p className="rowTitle">Action</p>
        <p className="rowData">{purchase_type}</p>
      </div>
      <div className="orderPreviewRow">
        <p className="rowTitle">Number of shares</p>
        <p className="rowData">{share_count}</p>
      </div>
      <div className="orderPreviewRow">
        <p className="rowTitle">Total price</p>
        <p className="rowData">{price * share_count}</p>
      </div>
    </div>
  );
};

export default PreviewOrder;
