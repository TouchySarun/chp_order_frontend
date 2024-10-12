"use client";
import { getOrders, OrderStatus } from "@/lib/order";
import React, { useState } from "react";
import PickingModal from "../components/order/PickingModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import BranchSelector from "../components/branchSelector";
import Dropdown from "../components/Dropdown";
import Pagination from "../components/Pagination";

enum orderByOption {
  name_asc = "ชื่อสินค้า : a-z",
  name_desc = "ชื่อสินค้า : z-a",
  code_asc = "บาร์สินค้า : a-z",
  code_desc = "บาร์สินค้า : z-a",
}
function getOrderByKey(value: string): keyof typeof orderByOption | undefined {
  for (const key in orderByOption) {
    // Type assertion to tell TypeScript that key is a valid key of orderByOption
    if (orderByOption[key as keyof typeof orderByOption] === value) {
      return key as keyof typeof orderByOption;
    }
  }
  return undefined;
}

function PickingPage() {
  const [selectOrder, setSelectOrder] = useState<OrderType>();
  const [orders, setOrders] = useState<OrderType[]>();
  const [branch, setBranch] = useState<string[]>([]);
  const [bnd, setBnd] = useState("");
  const [ap, setAp] = useState("");
  const [orderBy, setOrderBy] = useState("บาร์สินค้า : a-z");
  const [skuSearch, setSkuSearch] = useState("");
  const [username, setUsername] = useState("TOUCH");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [showFilter, setShowFilter] = useState(true);
  const [showPickingModal, setShowPickingModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [enableUsername, setEnableUsername] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGetOrders = async () => {
    setShowFilter(false);
    setLoading(true);
    const res = await getOrders({
      ap,
      bnd,
      branch,
      //code,
      //creBy: "TOUCH",
      //rack,
      search: skuSearch,
      status: [OrderStatus.init, OrderStatus.left],
      //username,
      limit: 20,
      page: 1,
      orderBy: getOrderByKey(orderBy),
    });
    if ("error" in res) {
      alert("Error, add new order");
      setLoading(false);
      return;
    }

    setOrders(res);
  };

  const handleSelectOrder = (order: OrderType) => {
    setSelectOrder(order);
    setShowPickingModal(true);
  };

  const onPickingModalClose = () => {
    setShowPickingModal(false);
    setSelectOrder(undefined);
  };

  return (
    <div className="container mx-auto py-10 px-5 flex flex-col gap-4">
      {showPickingModal && (
        <PickingModal order={selectOrder} onClose={onPickingModalClose} />
      )}
      {showBranchModal && (
        <BranchSelector
          onClose={() => setShowBranchModal(false)}
          selectedBranches={branch}
          setSelectedBranches={setBranch}
        />
      )}
      <div>
        <div className="flex justify-between">
          <h1 className="text-3xl text-orange-600 font-bold">จัดส่ง</h1>
          <button
            onClick={() => setShowFilter((e) => !e)}
            className="p-2 rounded-t-lg bg-gray-100"
          >
            <FontAwesomeIcon
              icon={faGear}
              className={`ml-5 transition-all duration-500 ease-in-out overflow-hidden ${
                showFilter ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
        <div
          className={`bg-gray-100 grid grid-cols-5 gap-2 items-center text-xs transition-all duration-500 ease-in-out p-2 rounded-b-md rounded-tl-md`}
        >
          <h1 className="text-lg col-span-5">ตัวกรอง</h1>
          <p className="text-right pr-1">เจ้าหนี้:</p>
          <input
            type="text"
            value={ap}
            onChange={(e) => setAp(e.target.value)}
            disabled={!showFilter}
            className={`border rounded  col-span-4 transition-all duration-500 ease-in-out ${
              showFilter ? "px-2 py-1 shadow-md" : "p-0 shadow-none"
            }`}
            placeholder="เจ้าหนี้ทั้งหมด"
          />
          <p className="text-right pr-1">ยี่ห้อ:</p>
          <input
            type="text"
            value={bnd}
            onChange={(e) => setBnd(e.target.value)}
            disabled={!showFilter}
            className={`border rounded col-span-4 transition-all duration-500 ease-in-out ${
              showFilter ? "px-2 py-1 shadow-md" : "p-0 shadow-none"
            }`}
            placeholder="ยี่ห้อสินค้าทั้งหมด"
          />
          <p className="text-right pr-1">สาขา:</p>
          <div className="col-span-4 py-2 flex flex-wrap gap-2 ">
            {branch.length > 0 &&
              branch.map((br) => (
                <p key={br} className="p-1 bg-blue-200 text-xs rounded-full">
                  {br}
                </p>
              ))}
            <button
              onClick={() => setShowBranchModal(true)}
              className={`rounded shadow-md bg-orange-400 text-white overflow-hidden transition-all duration-500 ease-in-out w-24 ${
                showFilter ? "h-6 px-5 py-1" : "h-0 p-0"
              }`}
            >
              เลือกสาขา
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              disabled={!showFilter}
              checked={enableUsername}
              onChange={() => setEnableUsername((e) => !e)}
            />
            <label htmlFor="" className="w-full text-right pr-1">
              ชื่อผู้ใช้:
            </label>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={true} // TODO: enable for admin
            className={`rounded col-span-4 transition-all duration-500 ease-in-out ${
              showFilter && enableUsername
                ? "px-2 py-1 shadow-md w-full bg-white"
                : "p-0 shadow-none" + (!enableUsername && " w-0")
            } 
            `}
          />
          <p className="text-right pr-1">เรียง: </p>
          <Dropdown
            className="col-span-4"
            disable={!showFilter}
            options={Object.values(orderByOption)}
            select={orderBy}
            setSelect={setOrderBy}
          />
          <button
            onClick={handleGetOrders}
            className={`bg-green-500 text-white rounded-lg shadow-md col-span-5 overflow-hidden transition-all duration-500 ease-in-out w-full ${
              showFilter ? "h-8 px-5 py-1" : "h-0 p-0"
            }`}
          >
            ยืนยัน
          </button>
        </div>
      </div>

      <div className="flex shadow-md rounded-lg sticky top-0">
        <input
          type="text"
          className="inline-block flex-auto w-3/4 border rounded-l-lg p-2"
          placeholder="ค้นหาสินค้า"
          value={skuSearch}
          onChange={(e) => setSkuSearch(e.target.value)}
        />
        <button
          onClick={handleGetOrders}
          className="inline-block flex-1 rounded-r-lg bg-green-500 text-white p-2"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      <div className="container flex flex-col gap-2 mx-auto p-2 rounded-lg shadow-lg border">
        {orders && orders.length > 0 ? (
          <>
            <div className="grid grid-cols-5 gap-1 rounded p-2 items-center text-lg">
              <p className="col-span-3 px-2">สินค้า</p>
              <p className="text-center col-span-2">จำนวน</p>
            </div>
            {orders.length > 0 &&
              orders?.map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleSelectOrder(order)}
                  className={
                    "grid grid-cols-5 gap-1 rounded p-2 items-center border"
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
                </button>
              ))}
          </>
        ) : (
          <div className="text-gray-500 flex flex-col items-center ">
            <p className="text-gray-500">ไม่มีคำสั่งให้แสดง</p>
            <p className="text-gray-500">โปรดตรวจสอบ การตั้งค่า</p>
          </div>
        )}
      </div>
      <Pagination
        limit={limit}
        page={page}
        all={1000}
        onChangePage={(p) => {
          setPage(p);
        }}
      />
    </div>
  );
}

export default PickingPage;
