import { useForm } from "react-hook-form";
import {
    type UpdatePasswordInputType,
    updatePasswordSchema,
} from "../../../schemas/user/updatePasswordSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import userApi from "../../../api/user/userApi.ts";
import {
    FormWrapper,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../components/post/post.style.tsx";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";

function MyPasswordPage() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
        mode: "onBlur",
    });

    const onSubmit = async (input: UpdatePasswordInputType) => {
        try {
            await userApi.updatePassword(input);
            alert("비밀번호를 성공적으로 변경했습니다.");
            reset({
                prevPassword: "",
                password: "",
                confirmPassword: "",
            })
        } catch (error) {
            console.log(error);
            let errorMessage = "비밀번호 변경 중 오류가 발생했습니다.";
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
                    비밀번호 변경 <small>소중한 내 비밀번호를 최신 상태로 관리하세요.</small>
                </PostTitle>
            </PostPageHeader>
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputGroup
                    type={"password"}
                    id={"prevPassword"}
                    label={"현재 비밀번호"}
                    placeholder={"현재 비밀번호를 입력해주세요."}
                    errorMessage={errors.prevPassword?.message}
                    registerObj={register("prevPassword")}
                />
                <InputGroup
                    type={"password"}
                    id={"password"}
                    label={"변경할 비밀번호"}
                    placeholder={"변경할 비밀번호를 입력해주세요."}
                    errorMessage={errors.password?.message}
                    registerObj={register("password")}
                />
                <InputGroup
                    type={"password"}
                    id={"confirmPassword"}
                    label={"변경할 비밀번호 확인"}
                    placeholder={"변경할 비밀번호를 다시 한번 입력해주세요."}
                    errorMessage={errors.confirmPassword?.message}
                    registerObj={register("confirmPassword")}
                />
                <AdminButtonGroup $align={"right"}>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        type={"submit"}
                        disabled={isSubmitting}>
                        비밀번호 변경
                    </Button>
                </AdminButtonGroup>
            </FormWrapper>
        </PostContainer>
    );
}

export default MyPasswordPage;
