import {Link, useNavigate, useParams } from "react-router";
import {useCallback, useEffect, useState} from "react";
import type {Inquiry} from "../../../../types/inquiry.type.ts";
import adminInquiryApi from "../../../../api/admin/adminInquiryApi.ts";
import {AdminButtonGroup, AdminContainer, AnswerSection} from "../../../../components/admin/admin.style.tsx";
import {DetailContent, DetailHeader, DetailInfo, DetailTitle, DetailWrapper, LoadingText} from "../../../../components/post/post.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import AdminInquiryAnswerBox from "../../../../components/inquiry/AdminInquiryAnswerBox.tsx";
import AdminInquiryAnswerForm from "../../../../components/inquiry/AdminInquiryAnswerForm.tsx";

function AdminInquiryDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{id: string}>();
    const inquiryId = Number(id);
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadInquiry = useCallback(async () => {
        try {
            const data = await adminInquiryApi.fetchInquiryById(inquiryId);
            setInquiry(data);
        } catch (error) {
            console.log(error);
            alert("문의글 상세를 조회하는데 실패했습니다.");
            navigate("/admin/inquiry");
        } finally {
            setIsLoading(false);
        }
    }, [inquiryId, navigate])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInquiry().then(() => {});
    }, [inquiryId, loadInquiry, navigate]);

    if (isLoading) {
        return (
            <AdminContainer>
                <LoadingText>문의글 내용을 불러오는 중입니다.</LoadingText>
            </AdminContainer>
        );
    }

    if (!inquiry) return;

    return (
        <AdminContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailTitle>{inquiry.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>{inquiry.user.nickname}</span>
                            <span>
                                {new Date(inquiry.createdAt).toLocaleString("ko-kr", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                <DetailContent>{inquiry.content}</DetailContent>

                <hr/>

                {/* 만약에, 답변이 아직 달리지 않았다면 Textarea를 띄어서 답변을 달 수 있도록 할 것이고
                답변이 이미 달렸다면 답변 내용이 출력 될 수 있도록 함 */}
                <AnswerSection>
                    { inquiry.answer ? (<AdminInquiryAnswerBox inquiry={inquiry}/>) : (<AdminInquiryAnswerForm onSuccess={loadInquiry} inquiryId={inquiryId}/>)}
                </AnswerSection>

                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button
                        color={"secondary"}
                        variant={"contained"}
                        onClick={() => navigate("/admin/inquiry")}>
                        목록으로
                    </Button>
                    <Button
                        color={"warning"}
                        variant={"contained"}
                        as={Link}
                        to={`/admin/inquiry/update/${inquiry.id}`}>
                        수정
                    </Button>
                    <Button color={"error"} variant={"contained"} >
                        삭제
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </AdminContainer>
    );
}

export default AdminInquiryDetailPage;