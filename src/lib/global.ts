import axiosInstance from "@/app/api/axios";

export const getBranches = async () => {
  try {
    const res = await axiosInstance.get("/branches");
    return res.data.sort() as string[];
  } catch (err: any) {
    return { error: err.response.data.error };
  }
};
