import { useForm } from "react-hook-form";
import { type NoticeInputType, noticeSchema } from "../../../../schemas/notice/noticeSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import adminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminLoadingText,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import { AuthRootErrorMessage } from "../../../../components/auth/auth.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import { useEffect, useState } from "react";
import noticeApi from "../../../../api/user/noticeApi.ts";

function AdminNoticeUpdatePage() {
    const {id} = useParams<{id: string}>();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<NoticeInputType>({
        resolver: zodResolver(noticeSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        const loadNotice = async () => {
            if (!id) return;
            try {
                const result = await noticeApi.getNoticeById(Number(id));

                // 데이터베이스를 조회해서 backend가 전달해 준 날짜-시간 관련 값은
                // 2026-05-06T00:00:00.000Z 형태 (ISO 8601 국제 표준 날짜 및 시간 표기법)
                // input type="date"로 지정한 input은 "2026-05-22"의 형태를 받아야 함
                // 결국 ISO 8601 표기법의 값 중 T부터 뒷부분을 잘라 전달해줘야 정상 출력 됨
                reset({
                    title: result.title,
                    content: result.content,
                });
            } catch (error) {
                console.log(error);
                alert("공지사항을 불러오는 도중 오류가 발생했습니다.");
                navigate("/admin/notice");
            } finally {
                setIsLoading(false);
            }
        };
        loadNotice().then(() => {});
    }, [id, navigate, reset]);

    const onSubmit = async (data: NoticeInputType) => {
        try {
            await adminNoticeApi.updateNotice(Number(id), data);
            alert("공지사항 업데이트가 완료 되었습니다.");
            navigate("/admin/notice");
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
                <AdminTitle>공지사항 정보 변경</AdminTitle>
            </AdminPageHeader>
            <Card>
                {isLoading ? (
                    <AdminLoadingText>데이터를 불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminForm onSubmit={handleSubmit(onSubmit)} >
                        <InputGroup
                            label={"제목"}
                            id={"title"}
                            errorMessage={errors.title?.message}
                            registerObj={register("title")}
                        />
                        <InputGroup
                            label={"본문(내용)"}
                            id={"content"}
                            errorMessage={errors.content?.message}
                            registerObj={register("content")}
                        />
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
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminNoticeUpdatePage;
