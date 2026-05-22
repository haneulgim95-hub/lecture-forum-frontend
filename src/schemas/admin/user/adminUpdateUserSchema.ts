import { z } from "zod";
import { Gender, Role } from "../../../types/user.type.ts";

export const adminUpdateUserSchema = z.object({
    username: z.string().min(4),

    // 비밀번호는 들어올수도 있고, 안들어올 수도 있따.
    password: z.string().min(6).optional(),
    name: z.string().min(2),
    nickname: z.string().min(2).max(10),
    email: z.email(),
    phoneNumber: z.string().min(5).optional(),
    birthdate: z.string().optional(),
    gender: z.enum(Gender),

    // 관리자가 생성을 할때에는 role도 선택가능하게끔 넣어줘야한다.
    role: z.enum(Role),
});

export type AdminUpdateUserInputType = z.infer<typeof adminUpdateUserSchema>;
