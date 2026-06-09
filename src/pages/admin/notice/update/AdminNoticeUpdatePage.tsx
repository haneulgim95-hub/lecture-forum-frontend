import {useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { type NoticeInputType, noticeSchema } from "../../../../schemas/notice/noticeSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import noticeApi from "../../../../api/user/noticeApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminLoadingText,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import {AuthRootErrorMessage} from "../../../../components/auth/auth.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import adminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";
import axios from "axios";

function AdminNoticeUpdatePage() {
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        reset,  // react-hook-form이 관리하고 있는 state 값을 리셋하겠다.
        // setValues,  // react-hook-form이 관리하고 있는 state 값을 정하겠다.  => 둘 중 하나 선택 가능!
        formState: { errors, isSubmitting },
    } = useForm<NoticeInputType>({
        resolver: zodResolver(noticeSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        const loadNotice = async () => {
            if (!id) return;
            try {
                const data = await noticeApi.getNoticeById(Number(id));

                reset({
                    title: data.title,
                    content: data.content,
                });
            } catch (error) {
                console.log(error);
                alert("존재하지 않거나 삭제된 공지사항입니다.");
                navigate("/admin/notice");
            } finally {
                setIsLoading(false);
            }
        };
        loadNotice().then(() => {});
    }, [id, navigate, reset]);

    const execUpdate = async (data: NoticeInputType) => {
        try {
            await adminNoticeApi.updateNotice(Number(id), data);
            alert("공지사항 업데이트가 완료 되었습니다.");
            navigate(`/admin/notice/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError("root", { message: error.response?.data?.message });
            }
            setError("root", { message: "공지사항 업데이트에 실패했습니다."});
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>공지사항 수정</AdminTitle>
            </AdminPageHeader>

            <Card>
                {isLoading ? (
                    <AdminLoadingText>데이터를 불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminForm onSubmit={handleSubmit(execUpdate)}>
                        <InputGroup
                            label={"제목"}
                            id={"title"}
                            errorMessage={errors.title?.message}
                            registerObj={register("title")}
                        />
                        <TextareaGroup
                            label={"본문(내용)"}
                            id={"content"}
                            errorMessage={errors.content?.message}
                            registerObj={register("content")}
                        />
                        <div style={{ width: "100%", gap: "32px" }}>
                            {errors.root && (
                                <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>
                            )}
                            <AdminButtonGroup >
                                <Button
                                    color={"secondary"}
                                    variant={"text"}
                                    onClick={() => navigate(-1)}>
                                    취소
                                </Button>
                                <Button
                                    type={"submit"}
                                    color={"primary"}
                                    variant={"contained"}
                                    disabled={isSubmitting}>
                                    { isSubmitting ? "저장 중" : "수정"}
                                </Button>
                            </AdminButtonGroup>
                        </div>
                    </AdminForm>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminNoticeUpdatePage;
