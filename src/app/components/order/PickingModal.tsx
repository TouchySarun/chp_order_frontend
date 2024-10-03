"use client";
import React, { useState } from "react";

interface PickingModalProps {
  order?: OrderType;
  onClose: () => void;
}
function PickingModal({ onClose, order }: PickingModalProps) {
  const [qty, setQty] = useState<number>();

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="w-full relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="w-full">
                {order && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <h3
                        className="text-xl font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        อัพเดทคำสั่ง
                      </h3>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={onClose}
                      >
                        ยกเลิก
                      </button>
                    </div>
                    <div
                      className={
                        "grid grid-cols-5 gap-1 items-center bg-gray-50 p-2 rounded"
                      }
                    >
                      <div className="col-span-3 text-left">
                        <div className="flex text-gray-400 gap-2 items-center">
                          <p className="text-xs">สาขา</p>
                          <p className="font-semibold">{order.branch}</p>
                        </div>
                        <div className="text-wrap">
                          <p className="py-1 text-lg font-bold">{order.code}</p>
                          <p className="text-sm">{order.name}</p>
                        </div>
                      </div>
                      <p className="text-center text-lg px-2 py-1 rounded-full bg-orange-200 font-bold">
                        {order.leftQty}
                      </p>
                      <p className="text-sm">{order.utqName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col px-4 py-3">
              <label htmlFor="qty" className="text-sm text-gray-400">
                จำนวนที่จัดได้
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="qty"
                  className="inline-block w-3/4 border rounded-lg p-2"
                  placeholder="จำนวนที่จัดได้"
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => setQty(0)}
                  className="ml-2 w-1/4 inline-flex justify-center rounded-l-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-500"
                >
                  จัดไม่ได้
                </button>
                <button
                  type="button"
                  onClick={() => setQty(order?.leftQty)}
                  className="w-1/4 inline-flex justify-center rounded-r-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-500 sm:ml-3 sm:w-auto"
                >
                  ครบถ้วน
                </button>
              </div>
              <button className="mt-8 w-full inline-block text-lg rounded-lg bg-green-500 text-white py-2 w-1/4">
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PickingModal;
