import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    type WithdrawUserInputType,
    withdrawUserSchema,
} from "../../../schemas/user/withdrawUserSchema.ts";
import userApi from "../../../api/user/userApi.ts";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../stores/auth/authStore.ts";
import styled from "styled-components";
import {
    FormWrapper,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../components/post/post.style.tsx";
import Card from "../../../components/common/card/Card.tsx";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";

function MyWithdrawPage() {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WithdrawUserInputType>({
        resolver: zodResolver(withdrawUserSchema),
        mode: "onBlur",
    });

    const onSubmit = async (input: WithdrawUserInputType) => {
        try {
            await userApi.withdrawUser(input);
            alert("회원탈퇴를 완료하였습니다. \n그동안 본 사이트를 이용해주셔서 감사합니다.");
            logout();
            navigate("/");
        } catch (error) {
            console.log(error);
            let errorMessage = "회원탈퇴 중 오류가 발생했습니다.";
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            alert(errorMessage);
        }
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    회원 탈퇴 <small>안전한 계정 삭제를 위해 비밀번호를 확인합니다.</small>
                </PostTitle>
            </PostPageHeader>
            <Card>
                <WarningBox>
                    <WarningTitle>회원 탈퇴 전 꼭 확인해주세요.</WarningTitle>
                    <WarningList>
                        <li>탈퇴 시 사용자의 모든 개인 정보와 프로필 데이터가 파기됩니다.</li>
                        <li>
                            기존 게시글 및 댓글에 대한 수정이나 삭제를 더이상 진행할 수 없게 됩니다.
                        </li>
                        <li>
                            기존 게시글 및 댓글의 삭제를 원하실 경우, 탈퇴 전 직접 삭제하셔야
                            합니다.
                        </li>
                    </WarningList>
                </WarningBox>
                <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup
                        type={"password"}
                        label={"비밀번호 확인"}
                        id={"password"}
                        errorMessage={errors.password?.message}
                        registerObj={register("password")}
                        placeholder={"본인 확인을 위해 현재 비밀번호를 입력하세요."}
                    />
                    <AdminButtonGroup>
                        <Button
                            color={"error"}
                            variant={"contained"}
                            type={"submit"}
                            disabled={isSubmitting}>
                            회원 탈퇴
                        </Button>
                    </AdminButtonGroup>
                </FormWrapper>
            </Card>
        </PostContainer>
    );
}

export default MyWithdrawPage;

const WarningBox = styled.div`
    background-color: ${props => props.theme.colors.error}10;
    border: 1px solid ${props => props.theme.colors.error};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 40px;
`;

const WarningTitle = styled.h4`
    font-weight: 700;
    color: ${props => props.theme.colors.error};
    margin-bottom: 12px;
`;

const WarningList = styled.ul`
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
        font-size: 14px;
        line-height: 1.5;
    }
`;
