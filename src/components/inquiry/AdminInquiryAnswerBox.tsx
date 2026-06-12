import type { Inquiry } from "../../types/inquiry.type.ts";
import { AdminButtonGroup } from "../admin/admin.style.tsx";
import { DetailContent, DetailHeader, DetailTitle } from "../post/post.style.tsx";
import Button from "../common/button/Button.tsx";
import { Link } from "react-router";
import adminInquiryApi from "../../api/admin/adminInquiryApi.ts";

interface Props {
    inquiry: Inquiry;
    onSuccess: () => Promise<void>;
}

function AdminInquiryAnswerBox({ inquiry, onSuccess }: Props) {
    const handleDeleteAnswer = async () => {
        try {
            await adminInquiryApi.deleteInquiryAnswer(inquiry.id);
            alert("문의 답변을 성공적으로 삭제했습니다.");
            await onSuccess();
        } catch (error) {
            console.log(error);
            alert("문의 답변을 취소하는중 오류가 발생했습니다.");
        }
    };

    return (
        <><DetailHeader>
            <DetailTitle>문의 내용 답변</DetailTitle>
        </DetailHeader>

            <DetailContent>{inquiry.content}</DetailContent>

            <AdminButtonGroup style={{ marginTop: "40px" }}>
                <Button
                    color={"warning"}
                    variant={"contained"}
                    as={Link}
                    to={`/admin/inquiry/update/answer/${inquiry.id}`}>
                    수정
                </Button>
                <Button color={"error"} variant={"contained"} onClick={handleDeleteAnswer}>
                    삭제
                </Button>
            </AdminButtonGroup></>
    );
}

export default AdminInquiryAnswerBox;
