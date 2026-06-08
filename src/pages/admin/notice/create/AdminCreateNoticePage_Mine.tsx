import { useForm } from "react-hook-form";
import { type NoticeInputType, noticeSchema } from "../../../../schemas/notice/noticeSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import { AuthRootErrorMessage } from "../../../../components/auth/auth.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import { Link, useNavigate } from "react-router";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import adminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";
import axios from "axios";

function AdminCreateNoticePage_Mine() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<NoticeInputType>({
        resolver: zodResolver(noticeSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: NoticeInputType) => {
        try {
            await adminNoticeApi.createNotice(data);
            alert("공지사항이 성공적으로 추가되었습니다.");
            navigate("/admin/notice");
        } catch (error) {
            console.log("공지사항 등록 실패 : ", error);
            let errorMessage = "공지사항 등록 중 오류가 발생했습니다.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message() || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>새 공지사항 추가</AdminTitle>
            </AdminPageHeader>
            <Card>
                <AdminForm onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup
                        label={"제목"}
                        id={"title"}
                        errorMessage={errors.title?.message}
                        registerObj={register("title")}
                        placeholder={"공지사항 제목을 입력해주세요."}
                    />
                    <TextareaGroup
                        label={"내용(본문)"}
                        id={"content"}
                        errorMessage={errors.content?.message}
                        registerObj={register("content")}
                        placeholder={"공지사항 본문을 입력해주세요."}></TextareaGroup>
                    <div style={{ width: "100%", gap: "32px" }}>
                        {errors.root && (
                            <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>
                        )}
                        <AdminButtonGroup>
                            <Button
                                color={"secondary"}
                                variant={"text"}
                                as={Link}
                                to={"/admin/notice"}>
                                취소
                            </Button>
                            <Button
                                type={"submit"}
                                color={"primary"}
                                variant={"contained"}
                                disabled={isSubmitting}>
                                등록
                            </Button>
                        </AdminButtonGroup>
                    </div>
                </AdminForm>
            </Card>
        </AdminContainer>
    );
}

export default AdminCreateNoticePage_Mine;
