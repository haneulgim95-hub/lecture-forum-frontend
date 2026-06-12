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

const fetchInquiryById = async (id: number): Promise<Inquiry> => {
    const response = await axiosInstance.get(`/admin/inquiry/${id}`);
    return response.data.data;
};

const deleteInquiry = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/inquiry/${id}`);
};

export default { fetchInquiryList, fetchInquiryById, deleteInquiry };
