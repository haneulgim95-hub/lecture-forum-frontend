import axiosInstance from "../axiosInstance.ts";
import type { UpdateUserInputType } from "../../schemas/user/updateUserSchema.ts";
import type { User } from "../../types/user.type.ts";
import type { UpdatePasswordInputType } from "../../schemas/user/updatePasswordSchema.ts";
import type {WithdrawUserInputType} from "../../schemas/user/withdrawUserSchema.ts";

const updateUser = async (data: UpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch(`/user/update`, data);
    return response.data.data;
};

const updatePassword = async (data: UpdatePasswordInputType): Promise<void> => {
    await axiosInstance.patch("/user/password", data);
};

const withdrawUser = async (data: WithdrawUserInputType): Promise<void> => {
    await axiosInstance.patch("/user/withdraw", data);
};

export default { updateUser, updatePassword, withdrawUser };