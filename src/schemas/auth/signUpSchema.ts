// 검증에 사용할 명세를 만드는 작업.

import { z } from "zod";
import { Gender } from "../../types/user.type.ts";

const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;

// zod를 통해 검증할 Input 값에 대한 객체모양 생성
export const signUpSchema = z.object({
    username: z.string().min(4, "아이디는 4자 이상 입력해주세요."),
    password: z.string().min(6, "비밀번호는 6자 이상 입력해주세요."),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    name: z.string().min(2, "이름을 정확히 입력해주세요."),
    nickname: z.string().min(2, "닉네임은 2자 이상 입력해주세요").max(10, "닉네임은 10자 이하로 입력해주세요."),
    email: z.email("올바른 이메일 형식이 아닙니다."),
    phoneNumber: z.string().regex(phoneRegex, "올바른 전화번호 형식이 아닙니다.").optional(),
    birthdate: z.string().optional(),
    gender: z.enum(Gender, "성별은 필수값 입니다."),
})

.refine(data => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다."
})

// 위에서 만든 createUserSchema는 조건을 건 "객체"를 만드는 일이라, 앞으로 다른 곳에서 사용할 타입을 만들어줘야 함
export type SignUpInputType = z.infer<typeof signUpSchema>;
