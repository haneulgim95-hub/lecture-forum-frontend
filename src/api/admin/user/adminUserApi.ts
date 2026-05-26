import axiosInstance from "../../axiosInstance.ts";
import type { User } from "../../../types/user.type.ts";
import type { AdminCreateUserInputType } from "../../../schemas/admin/user/adminCreateUserSchema.ts";
import type { AdminUpdateUserInputType } from "../../../schemas/admin/user/adminUpdateUserSchema.ts";
import type { PaginationResponseType } from "../../../types/common.type.ts";

const fetchUserList = async (page: number, size: number): Promise<PaginationResponseType<User>> => {
    // get 방식은 body x, 무조근 url에 데이터를 담아 전송
    // => 1. 경로에 포함     /admin/user/list/3번페이지/20개   /admin/user/list/3/20  2개 데이터를 params에서 꺼내온다
    // => 2. 쿼리스트링에 포함                                /admin/user/list?page=3&size=20   2개 데이터를 searchParams에서 꺼내온다
    // 2가지 방식 모두 가능하나,
    // 따라서 1번 방식으로 진행하면, "무조건" /로 나눠지는 5개가 맞아야 라우팅에 걸림
    // 2번 방식으로 진행하면 /admin/user/list 까지만 맞아도 라우팅에 걸림

    // /admin/user/list로 요청이 오면 (page, size가 없어도) 목록을 뱉어줄 것임 //page와 size는 부가정보
    const response = await axiosInstance.get(`/admin/user/list?page=${page}&size=${size}`);
    return response.data.data;
};

const fetchUserById = async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/admin/user/${id}`);
    return response.data.data;
}

const createUser = async (data: AdminCreateUserInputType): Promise<User> => {
    const response = await axiosInstance.post("/admin/user/create", data);
    return response.data.data;
};

const updateUser = async (id: number, input: AdminUpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch(`/admin/user/${id}`, input);
    return response.data.data;
};

const deleteUser = async (id: number): Promise<User> => {
    const response = await axiosInstance.patch(`/admin/user/${id}/delete`);
    return response.data.data;
}

export default { fetchUserList, createUser, updateUser, fetchUserById, deleteUser };