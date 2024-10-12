import axiosInstance from "@/app/api/axios";
export enum OrderStatus {
  init = "init",
  left = "left",
  picking = "picking",
  shipping = "shipping",
  done = "done",
}

export const getCreateData = async (barcode: string, branch: string) => {
  try {
    const res = await axiosInstance.get(
      `/orders/create-data/${barcode}/${branch}`
    );
    const sku = {
      ...res.data.sku,
      goods: res.data.sku.goods.sort((a: GoodsType, b: GoodsType) => {
        if (a.utqQty !== b.utqQty) {
          return a.utqQty - b.utqQty; // Sort by utqQty ascending
        } else {
          return b.code.localeCompare(a.code); // Sort by code descending
        }
      }),
    };
    return {
      sku,
      order: res.data.order
        ? {
            ...res.data.order,
            startDate: res.data.order.startDate
              ? new Date(res.data.order.startDate)
              : undefined,
            endDate: res.data.order.endDate
              ? new Date(res.data.order.endDate)
              : undefined,
            lstUpd: res.data.order.lstUpd
              ? new Date(res.data.order.lstUpd)
              : undefined,
          }
        : undefined,
      lstSuccess: res.data.lstSuccess
        ? new Date(res.data.lstSuccess)
        : undefined,
    } as OrderCreateData;
  } catch (err: any) {
    console.log("Error get order by sku. :", err);
    return { error: err.response.data.error };
  }
};

export const createOrder = async (order: OrderType) => {
  try {
    const res = await axiosInstance.post(`/orders`, { ...order });
    if (res.status == 200) {
      return { success: true };
    } else {
      return { error: "..." };
    }
  } catch (err) {
    console.log("Error, create new order. :", err);
    return { error: "..." };
  }
};

export const editOrder = async (order: OrderType) => {
  try {
    const res = await axiosInstance.put(`/orders`, { ...order });
    if (res.status == 200) {
      return { success: true };
    } else {
      return { error: "..." };
    }
  } catch (err: any) {
    console.log("Fail edit user. :", err);
    return { error: err.response.data.error };
  }
};

export const getOrders = async (filter: OrderFilter) => {
  try {
    if (isOrderFilterEmpty(filter)) {
      return { error: "must have at least 1 filter." };
    }
    const query = createOrderFilterQuery(filter);
    console.log(`/orders${query}`);

    // const res = await axiosInstance.get(`/orders${query}`);
    // console.log(res);
    // return res.data as OrderType[];
    return getMockOrders();
  } catch (err: any) {
    return { error: err.response.data.error };
  }
};

const isOrderFilterEmpty = (filter: OrderFilter) => {
  for (let key in filter) {
    if (filter[key]) {
      return false;
    }
  }
  return true;
};

const createOrderFilterQuery = (filter: OrderFilter) => {
  let query = `?limit=${filter.limit}&page=${filter.page}`;
  for (let key in filter) {
    if (key === "limit" || key === "page") {
      continue;
    }
    if (key === "status") {
      filter.status?.map((s) => (query += `&status=${s}`));
    } else if (key === "branch") {
      filter.branch?.map((b) => (query += `&branch=${b}`));
    } else {
      if (filter[key] !== "") query += `&${key}=${filter[key]}`;
    }
  }
  return query;
};

const getMockOrders = () => {
  return [
    {
      id: "1",
      startDate: new Date(),
      name: "น้ำดื่มสิงห์ 1500 มล",
      utqName: "แพค6",
      utqQty: 6,
      code: "8850999320021",
      sku: "1",
      ap: "1",
      creBy: "touch",
      qty: 150,
      leftQty: 150,
      pending: true,
      branch: "009",
      cat: "น้ำดื่ม",
      bnd: "สิงห์",
    },
    {
      id: "2",
      startDate: new Date(),
      name: "น้ำดื่มสิงห์ 600 มล",
      utqName: "แพค12",
      utqQty: 12,
      code: "8850999320007",
      sku: "2",
      ap: "1",
      creBy: "touch",
      qty: 200,
      leftQty: 200,
      pending: true,
      branch: "009",
      cat: "น้ำดื่ม",
      bnd: "สิงห์",
    },
    {
      id: "3",
      startDate: new Date(),
      name: "น้ำดื่มสิงห์ 600 มล",
      utqName: "แพค12",
      utqQty: 12,
      code: "8850999320007",
      sku: "2",
      ap: "1",
      creBy: "touch",
      qty: 200,
      leftQty: 200,
      pending: true,
      branch: "008",
      cat: "น้ำดื่ม",
      bnd: "สิงห์",
    },
    {
      id: "4",
      startDate: new Date(),
      name: "น้ำดื่มสิงห์ 600 มล",
      utqName: "แพค12",
      utqQty: 12,
      code: "8850999320007",
      sku: "2",
      ap: "1",
      creBy: "touch",
      qty: 200,
      leftQty: 200,
      pending: true,
      branch: "008",
      cat: "น้ำดื่ม",
      bnd: "สิงห์",
    },
    {
      id: "5",
      startDate: new Date(),
      name: "ตัวอย่างสินค้าที่ชื่อยาวมาก ถึงมากที่สุด และมันยาวมากจริงๆไม่อยากจะโม้",
      utqName: "กระสอบ*25",
      utqQty: 25,
      code: "8850999312345",
      sku: "3",
      ap: "2",
      creBy: "touch",
      qty: 1500,
      leftQty: 1500,
      pending: true,
      branch: "008",
      cat: "น้ำดื่ม",
      bnd: "สิงห์",
    },
  ] as OrderType[];
};
