import type { NoticeInputType } from "../../schemas/notice/noticeSchema.ts";
import axiosInstance from "../axiosInstance.ts";
import type { Notice } from "../../types/notice.type.ts";

const createNotice = async (input: NoticeInputType): Promise<Notice> => {
    const response = await axiosInstance.post("admin/notice/create", input);
    return response.data.data;
};

const updateNotice = async (noticeId: number, input: NoticeInputType): Promise<Notice> => {
    const response = await axiosInstance.patch(`admin/notice/${noticeId}`, input);
    return response.data.data;
};

const deleteNotice = async (noticeId: number): Promise<void> => {
    await axiosInstance.delete(`admin/notice/${noticeId}`);     // HTTP status 200 성공/ HTTP status 500 실패인지만 중요함. 응답 내용이 중요하지는 않음
};

export default { createNotice, updateNotice, deleteNotice };
