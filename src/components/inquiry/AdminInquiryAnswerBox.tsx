import type { Inquiry } from "../../types/inquiry.type.ts";
import { AdminButtonGroup, AnswerContent, AnswerDisplay, AnswerHeader } from "../admin/admin.style.tsx";
import Button from "../common/button/Button.tsx";
import adminInquiryApi from "../../api/admin/adminInquiryApi.ts";

interface Props {
    inquiry: Inquiry;
    reload: () => Promise<void>;
}

function AdminInquiryAnswerBox({ inquiry, reload }: Props) {
    const handleDeleteAnswer = async () => {
        try {
            await adminInquiryApi.deleteInquiryAnswer(inquiry.id);
            await reload();
        } catch (error) {
            console.log(error);
            alert("관리자 답변 삭제 중 오류가 발생되었습니다.");
        }
    };

    return (
        <AnswerDisplay>
            <AnswerHeader>
                <h4>관리자 답변</h4>
                <small>
                    답변 일시 :{" "}
                    {inquiry.answeredAt && new Date(inquiry.answeredAt).toLocaleString()}
                </small>
            </AnswerHeader>

            <AnswerContent className={"answer-content"}>{inquiry.answer}</AnswerContent>

            <AdminButtonGroup>
                <Button variant={"contained"} color={"warning"}>답변 수정</Button>
                <Button variant={"contained"} color={"error"} onClick={handleDeleteAnswer}>답변 삭제</Button>
            </AdminButtonGroup>
        </AnswerDisplay>
    );
}

export default AdminInquiryAnswerBox;
