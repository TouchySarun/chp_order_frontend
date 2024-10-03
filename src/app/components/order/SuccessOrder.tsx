import React from "react";

interface SuccessOrderProps {
  order: OrderType;
}

function SuccessOrder({ order }: SuccessOrderProps) {
  return (
    <div className="container flex flex-col gap-5 mx-auto my-3 p-2 rounded-lg shadow-lg border bg-green-100 text-center">
      <h2 className="text-2xl">สร้าง, อัปเดทคำสั่งสำเร็จ</h2>
      <p>{order.name}</p>
      <p>
        <span className="bg-orange-200 rounded-full px-2 py-1">
          {order.leftQty}
        </span>{" "}
        {order.utqName}
      </p>
    </div>
  );
}

export default SuccessOrder;
