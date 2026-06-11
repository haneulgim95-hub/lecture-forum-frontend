import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";

const fetchInquiryList = async (page: number, size: number): Promise<PaginationResponseType<Inquiry>> => {
    const response = await axiosInstance.get("/admin/inquiry/list", {
        params: {
            page,
            size,
        }
    })
    return response.data.data;
};

export default { fetchInquiryList };
