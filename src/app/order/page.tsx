"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import EditOrder from "../components/EditOrder";
import { getCreateData, createOrder, editOrder } from "@/lib/order";
import SuccessOrder from "../components/order/SuccessOrder";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faGear } from "@fortawesome/free-solid-svg-icons";

function OrderPage() {
  const barcodeRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);

  const [barcode, setBarcode] = useState("");
  const [selectBarcode, setSelectBarcode] = useState("");
  const [sku, setSKU] = useState<SKUType>();
  const [order, setOrder] = useState<OrderType>();
  const [qty, setQty] = useState("");
  const [tag, setTag] = useState("");
  const [branch, setBranch] = useState("000");
  const [username, setUsername] = useState("TOUCH");

  const [showEdit, setShowEdit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSkuDetail, setShowSkuDetail] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [lstSuccess, setLstSuccess] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const handleGetCreateData = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSKU(undefined);
    setOrder(undefined);
    setShowSuccess(false);

    const res1 = await getCreateData(barcode, branch);
    if ("error" in res1) {
      alert(res1.error);
      setLoading(false);
      return;
    }
    const { sku, order, lstSuccess } = res1;
    setSKU(sku);
    setOrder(order);
    setSelectBarcode(barcode);
    lstSuccess && setLstSuccess(lstSuccess.toLocaleDateString("en-GB"));
    setLoading(false);
    qtyRef.current?.focus();
  };

  const resetData = () => {
    setSKU(undefined);
    setBarcode("");
    setSelectBarcode("");
    setQty("");
    barcodeRef.current?.focus();
  };

  const handleCreateOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!sku) {
      alert("SKU not found.");
      return;
    }
    const selectGoods = sku.goods.find((g) => g.code === selectBarcode);
    if (!selectGoods) {
      alert("SelectGoods not found.");
      return;
    }
    const qtyNumber = parseInt(qty);
    if (isNaN(qtyNumber)) {
      alert("ใส่จำนวน");
      return;
    }
    setLoading(true);
    if (!order) {
      // add new order
      const newOrder: OrderType = {
        ap: sku.ap,
        bnd: sku.bnd,
        branch: branch,
        cat: sku.cat,
        code: selectBarcode,
        creBy: username,
        name: sku.name,
        qty: qtyNumber,
        utqName: selectGoods.utqName,
        utqQty: selectGoods.utqQty,
        sku: sku.id,
      };

      const res = await createOrder(newOrder);
      if ("error" in res) {
        alert("Error, add new order");
        setLoading(false);
        return;
      }
      setOrder(newOrder);
    } else {
      // update old order
      if (selectGoods.utqQty !== order.utqQty) {
        alert(
          `หน่วยนับไม่ตรงกับคำสั่งเดิม ไม่สามารถเพิ่มคำสั่งได้ \n หน่วยนับต้องเป็น ${order.utqQty}`
        );
        setLoading(false);
        return;
      }

      const newOrder: OrderType = {
        ...order,
        lstUpd: new Date(),
        qty: qtyNumber, // diff qty
      };
      const res = await editOrder(newOrder);
      if ("error" in res) {
        alert("Error, update order");
        setLoading(false);
        return;
      }
      setOrder({
        ...newOrder,
        qty: qtyNumber + order.qty,
        leftQty: qtyNumber + (order.leftQty || 0),
      });
    }
    setLoading(false);
    setShowSuccess(true);
    resetData();
  };

  const handleEditOrder = async (newOrder: OrderType) => {
    console.log("edit order");

    if (!order || !order.id) {
      console.log("no order id");

      return;
    }
    const res = await editOrder({
      ...newOrder,
      qty: newOrder.qty - order.qty,
      leftQty: newOrder.qty - (order.leftQty || 0),
    });
    if ("error" in res) {
      alert("Error, update order");
      return;
    }
    setOrder(newOrder);
    setShowSuccess(true);
    resetData();
  };
  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  return (
    <>
      <div className="container mx-auto py-10 px-5">
        {showEdit && order && sku && (
          <EditOrder
            order={order}
            sku={sku}
            onClose={() => setShowEdit(false)}
            setOrder={handleEditOrder}
          />
        )}
        <div className="flex justify-between">
          <h1 className="text-3xl text-orange-600 font-bold">สั่งสินค้า</h1>
          <button
            onClick={() => setShowSetting((e) => !e)}
            className="p-2 rounded-t-lg bg-gray-200"
          >
            <FontAwesomeIcon
              icon={faGear}
              className={`ml-5 transition-all duration-500 ease-in-out overflow-hidden ${
                showSetting ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
        <div
          className={`bg-gray-200 grid grid-cols-2 gap-2 items-center text-xs transition-all duration-500 ease-in-out overflow-hidden ${
            showSetting ? "max-h-80" : "max-h-0"
          }`}
        >
          <p className="text-right">สาขา:</p>
          <input
            ref={barcodeRef}
            type="text"
            className="m-2 inline-block border rounded p-2"
            placeholder="สาขา"
            value={branch}
            autoCorrect="true"
            onChange={(e) => setBranch(e.target.value)}
          />
        </div>
        <form className="flex my-3 shadow-md" onSubmit={handleGetCreateData}>
          <input
            ref={barcodeRef}
            type="text"
            className="inline-block flex-auto w-3/4 border rounded-l-lg p-2"
            placeholder="สแกนสินค้า"
            value={barcode}
            autoCorrect="true"
            onChange={(e) => setBarcode(e.target.value)}
          />
          <button className="inline-block flex-1 rounded-r-lg bg-green-500 text-white p-2">
            search
          </button>
        </form>
        {showSuccess && order && <SuccessOrder order={order} />}
        {loading ? (
          <Loading />
        ) : (
          sku && (
            <div className="container flex flex-col gap-5 mx-auto my-3 p-2 rounded-lg shadow-lg border">
              <div className={`py-2 flex flex-col gap-2`}>
                <button
                  onClick={() => setShowSkuDetail((e) => !e)}
                  className="text-xl text-left text-blue-400"
                >
                  {sku.name}
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className={`ml-5 transition-all duration-500 ease-in-out overflow-hidden ${
                      showSkuDetail ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`grid grid-cols-4 gap-2 text-xs transition-all duration-500 ease-in-out overflow-hidden ${
                    showSkuDetail ? "max-h-80" : "max-h-0"
                  }`}
                >
                  <p>ประเภท: </p>
                  <span className="bg-blue-50 rounded-md px-2 py-1 col-span-3">
                    {sku.cat}
                  </span>
                  <p>ยี่ห้อ: </p>
                  <span className="bg-blue-50 rounded-md px-2 py-1 col-span-3">
                    {sku.bnd}
                  </span>
                  <p>เจ้าหนี้: </p>
                  <span className="bg-blue-50 rounded-md px-2 py-1 col-span-3">
                    {sku.ap}
                  </span>
                </div>
              </div>
              <div>
                <div className="bg-orange-50 p-2">
                  {order ? (
                    <div className=" flex justify-between gap-2 items-center">
                      <div>
                        <p>
                          คำสั่งคงค้าง{" "}
                          <span className="bg-orange-200 rounded-full px-2 py-1">
                            {order.leftQty}
                          </span>{" "}
                          {order.utqName}
                        </p>
                        <span className="text-gray-500 text-xs">
                          {order.startDate.toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowEdit(true)}
                        className="bg-orange-500 shadow-md px-3 py-1 rounded-lg text-white"
                      >
                        แก้ไข
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-400">ไม่มีคำสั่งคงค้าง</p>
                  )}
                </div>
                <p className="w-full p-2 bg-gray-200">
                  {lstSuccess ? (
                    <>
                      จัดส่งล่าสุด{" "}
                      <span className="bg-orange-200 rounded-full px-2 py-1">
                        {lstSuccess}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">
                      สาขายังไม่เคยได้รับสินค้านี้จากคลัง
                    </span>
                  )}
                </p>
              </div>
              <div className="py-2">
                <div className="flex items-end flex-wrap">
                  <h3 className="text-xl text-gray-400">สั่งรอบปัจจุบัน</h3>
                  <span className="text-xs text-gray-400 ml-3">
                    *ถ้าในระบบมีคำสั่งอยู่แล้ว จะเป็นการสั่งเพิ่ม
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-2 border rounded">
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
                        name="barcode"
                        id={goods.code}
                        value={goods.code}
                        className="hidden"
                        onChange={(e) => setSelectBarcode(e.target.value)}
                      />
                      <p className="col-span-2 ">{goods.code}</p>
                      <p>{goods.utqName}</p>
                    </label>
                  ))}
                </div>
              </div>
              <form onSubmit={handleCreateOrder}>
                <div className="flex my-3 shadow-md">
                  <label
                    htmlFor="qty"
                    className="inline-block flex-1 border rounded-l-lg p-2 bg-orange-600 text-white"
                  >
                    จำนวน
                  </label>
                  <input
                    ref={qtyRef}
                    type="text"
                    name="qty"
                    id="qty"
                    placeholder="กรอกจำนวนสั่งสินค้า"
                    autoFocus
                    className="inline-block flex-auto w-3/4 rounded-r-lg border p-2"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <button
                    type="button"
                    onClick={resetData}
                    className="bg-red-500 shadow-md px-3 py-2 rounded-lg text-white"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 shadow-md px-3 py-2 rounded-lg text-white flex-auto w-3/4"
                  >
                    ยืนยัน
                  </button>
                </div>
              </form>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default OrderPage;
