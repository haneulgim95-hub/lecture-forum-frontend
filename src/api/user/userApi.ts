import type { UpdateUserInputType } from "../../schemas/user/updateUserSchema.ts";
import axiosInstance from "../axiosInstance.ts";
import type { User } from "../../types/user.type.ts";
import type { UpdatePasswordInputType } from "../../schemas/user/updatePasswordSchema.ts";
import type { WithdrawUserInputType } from "../../schemas/user/withdrawUserSchema.ts";

const updateUser = async (input: UpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch("/user/update", input);
    return response.data.data;
};

const updatePassword = async (input: UpdatePasswordInputType): Promise<void> => {
    await axiosInstance.patch("/user/password", input);
}

const withdrawUser = async (input: WithdrawUserInputType): Promise<void> => {
    await axiosInstance.patch("/user/withdraw", input);
};

export default { updateUser, updatePassword, withdrawUser };