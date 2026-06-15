import { useForm } from "react-hook-form";
import {
    type UpdateUserInputType,
    updateUserSchema,
} from "../../../schemas/user/updateUserSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import userApi from "../../../api/user/userApi.ts";
import { isAxiosError } from "axios";
import {
    FormWrapper,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../components/post/post.style.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import { useEffect } from "react";
import { useAuthStore } from "../../../stores/auth/authStore.ts";

function MyInfoPage() {
    const { user } = useAuthStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserInputType>({
        resolver: zodResolver(updateUserSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        if (user) {
            reset({
                nickname: user.nickname,
                email: user.email,
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (input: UpdateUserInputType) => {
        try {
            const result = await userApi.updateUser(input);
            alert("회원정보를 성공적으로 수정했습니다.");
            useAuthStore.setState({ user: result });
        } catch (error) {
            console.log(error);
            let errorMessage = "회원정보 수정 중 오류가 발생했습니다.";
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            alert(errorMessage);
        }
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    회원정보 수정 <small>당신의 소중한 회원정보를 최신정보로 변경해주세요.</small>
                </PostTitle>
            </PostPageHeader>
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputGroup
                    id={"username"}
                    label={"아이디"}
                    readOnly={true}
                    disabled={true}
                    value={user?.username}
                />
                <InputGroup
                    id={"name"}
                    label={"이름"}
                    readOnly={true}
                    disabled={true}
                    value={user?.name}
                />
                <InputGroup
                    id={"nickname"}
                    label={"닉네임"}
                    errorMessage={errors.nickname?.message}
                    registerObj={register("nickname")}
                    placeholder={"변경할 닉네임을 입력해주세요."}
                />
                <InputGroup
                    id={"email"}
                    label={"이메일"}
                    errorMessage={errors.email?.message}
                    registerObj={register("email")}
                    placeholder={"변경할 이메일을 입력해주세요."}
                />
                <InputGroup
                    id={"phoneNumber"}
                    label={"휴대폰번호(선택)"}
                    errorMessage={errors.phoneNumber?.message}
                    registerObj={register("phoneNumber")}
                    placeholder={"변경할 휴대폰 번호를 입력해주세요."}
                />

                <AdminButtonGroup $align={"right"} style={{ marginTop: "30px" }}>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        type={"submit"}
                        disabled={isSubmitting}>
                        회원정보 변경
                    </Button>
                </AdminButtonGroup>
            </FormWrapper>
        </PostContainer>
    );
}

export default MyInfoPage;
