import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";
import type { InquiryAnswerInputType } from "../../schemas/inquiry/inquiryAnswerSchema.ts";

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

const updateInquiryAnswer = async (inquiryId: number, input: InquiryAnswerInputType): Promise<Inquiry> => {
    const response = await axiosInstance.patch(`/admin/inquiry/${inquiryId}`, input);
    return response.data.data;
};

const deleteInquiryAnswer = async (inquiryId: number): Promise<void> => {
    await axiosInstance.delete(`/admin/inquiry/${inquiryId}`);
};

const deleteInquiry = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/inquiry/${id}`);
};

export default { fetchInquiryList, fetchInquiryById, updateInquiryAnswer, deleteInquiryAnswer, deleteInquiry };
