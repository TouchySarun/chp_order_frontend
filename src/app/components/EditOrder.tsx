"use client";

import React, { useState } from "react";

interface EditOrderProps {
  order: OrderType;
  sku: SKUType;
  onClose: () => void;
  setOrder: (order: OrderType) => void;
}

function EditOrder({
  order: inputOrder,
  sku,
  onClose,
  setOrder: setOutput,
}: EditOrderProps) {
  const [selectBarcode, setSelectBarcode] = useState(inputOrder.code);
  const [qty, setQty] = useState(inputOrder.qty.toString());
  const [tag, setTag] = useState("");

  const handleClose = (force: boolean) => {
    if (!force) {
      if (!window.confirm("ยกเลิกข้อมูลที่บันทึก")) {
        return;
      }
    }
    onClose();
  };

  const handleSubmit = () => {
    const qtyNumber = parseInt(qty);
    if (isNaN(qtyNumber)) {
      alert("ใส่จำนวน");
      return;
    }
    const selectGoods = sku.goods.find((goods) => goods.code === selectBarcode);
    if (!selectGoods) return;
    const newOrder: OrderType = {
      ...inputOrder,
      utqName: selectGoods.utqName,
      utqQty: selectGoods.utqQty,
      code: selectBarcode,
      qty: qtyNumber,
      leftQty: qtyNumber,
      tag: tag,
    };
    setOutput(newOrder);
    handleClose(true);
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="flex flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => handleClose(false)}
                  >
                    ยกเลิก
                  </button>
                </div>
                <div className="text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    className="text-xl font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    แก้ไขคำสั่ง
                  </h3>
                  <div className="mt-2 flex flex-col gap-1">
                    {sku.goods.map((goods) => (
                      <label
                        key={goods.code}
                        htmlFor={goods.code}
                        className={
                          "grid grid-cols-3 gap-1 rounded px-2 border" +
                          (selectBarcode === goods.code
                            ? " bg-orange-200 py-3 shadow"
                            : " bg-yellow-50 py-1")
                        }
                      >
                        <input
                          type="radio"
                          className="hidden"
                          name="barcode"
                          id={goods.code}
                          value={goods.code}
                          onChange={(e) => setSelectBarcode(e.target.value)}
                        />
                        <p className="col-span-2 ">{goods.code}</p>
                        <p>{goods.utqName}</p>
                      </label>
                    ))}
                    <div className="flex my-3 shadow-md">
                      <label
                        htmlFor="qty"
                        className="inline-block flex-1 border rounded-l-lg p-2 bg-orange-600 text-white"
                      >
                        จำนวน
                      </label>
                      <input
                        type="text"
                        name="qty"
                        id="qty"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="inline-block flex-auto w-3/4 rounded-r-lg border p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex gap-4">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                ลบคำสั่ง
              </button>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-500 sm:ml-3 sm:w-auto"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditOrder;
