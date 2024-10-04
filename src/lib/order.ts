//TODO: readable error
import axiosInstance from "@/app/api/axios";
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
  } catch (err) {
    console.log("Fail edit user. :", err);
    return { error: "..." };
  }
};
