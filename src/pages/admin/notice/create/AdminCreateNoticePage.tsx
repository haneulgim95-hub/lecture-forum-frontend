import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NoticeInputType, noticeSchema } from "../../../../schemas/notice/noticeSchema.ts";
import adminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminPageHeader,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function AdminCreateNoticePage() {
    const navigate = useNavigate();

    // 구조분해 할당을 통해 값을 바로 꺼내서 변수에 저장하는 행위는
    // 모든 값들을 뽑지 않아도 됨. 내가 필요한 것만 뽑아올 수 있음
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        // useForm<제네릭을 통해 관리할 state모양(타입)지정>(옵션객체)
    } = useForm<NoticeInputType>({
        resolver: zodResolver(noticeSchema),
        mode: "onBlur",
    });

    const execSubmit = async (data: NoticeInputType) => {
        try {
            // 백엔드에게 요청을 보냈을 때 발생되는 에러 내용을 확인
            await adminNoticeApi.createNotice(data);
            navigate("/admin/notice");
        } catch (error) {
            console.log("공지사항 등록 실패: ", error);
            alert("공지사항 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminPageHeader>새 공지사항 등록</AdminPageHeader>
            </AdminPageHeader>

            <Card>
                <AdminForm onSubmit={handleSubmit(execSubmit)}>
                    <InputGroup
                        id={"title"}
                        label={"제목"}
                        placeholder={"제목을 입력해주세요"}
                        errorMessage={errors.title?.message}
                        registerObj={register("title")}
                    />
                    <TextareaGroup
                        id={"content"}
                        label={"내용(본문)"}
                        placeholder={"내용을 입력해주세요"}
                        errorMessage={errors.content?.message}
                        registerObj={register("content")}
                    />
                    <AdminButtonGroup>
                        <Button color={"secondary"} variant={"text"} as={Link} to={"/admin/notice"}>
                            취소
                        </Button>
                        <Button
                            color={"primary"}
                            variant={"contained"}
                            type={"submit"}
                            disabled={isSubmitting}>
                            등록
                        </Button>
                    </AdminButtonGroup>
                </AdminForm>
            </Card>
        </AdminContainer>
    );
}

export default AdminCreateNoticePage;
