import { Link, useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import type { Inquiry } from "../../../../types/inquiry.type.ts";
import adminInquiryApi from "../../../../api/admin/adminInquiryApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AnswerSection,
} from "../../../../components/admin/admin.style.tsx";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
} from "../../../../components/post/post.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import AdminInquiryAnswerBox from "../../../../components/inquiry/AdminInquiryAnswerBox.tsx";
import AdminInquiryAnswerForm from "../../../../components/inquiry/AdminInquiryAnswerForm.tsx";

function AdminInquiryDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const inquiryId = Number(id);
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEdit, setIsEdit] = useState(false);

    // useCallback() : React에서 제공하는 기능
    // loadInquiry는 useEffect 안에 있을 때는 계속 새로운 애가 생성되는건데
    // 밖으로 뺏기 때문에 loadInquiry 얘는 유일한 애가 되었음
    // useCallback은 불러낼 때 이 안에 넣은 함수가 재생성 되는걸 결정하는 의존성 배열

    // useEffect : 초기 렌더링이 끝난 이후에 1회 무조건 실행
    // 의존성 배열에 존재하는 값이 변경이 될 경우 재실행
    // useCallback : 최초에 함수가 생성되어 메모리에 저장
    // 의존성 배열에 존재하는 값이 변경이 될 경우, 함수를 재생성

    // loadInquiry라고 작성한 함수는, AdminInquiryDetailPage(부모 컴포넌트)가
    // 화면에 출력이 될 때 완성상태로 메모리에 적재되고
    /// 그걸 계속 useEffect가 불러와서 쓰게 됨 -> 뭔가 상황이 바뀌었다는 걸 의미
    // useCallback으로, 상황이 바뀐걸 반영해서 함수를 재생성해달라고 씀
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
    }, [inquiryId, navigate]);

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

                <hr />

                {/* 만약에, 답변이 아직 달리지 않았다면 Textarea를 띄어서 답변을 달 수 있도록 할 것이고
                답변이 이미 달렸다면 답변 내용이 출력 될 수 있도록 함 */}
                <AnswerSection>
                    {inquiry.answer && !isEdit? (
                        <AdminInquiryAnswerBox inquiry={inquiry} reload={loadInquiry} setIsEdit={setIsEdit}/>
                    ) : (
                        <AdminInquiryAnswerForm reload={loadInquiry} inquiry={inquiry} isEdit={isEdit} setIsEdit={setIsEdit}/>
                    )}
                </AnswerSection>

                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button
                        color={"secondary"}
                        variant={"contained"}
                        onClick={() => navigate("/admin/inquiry")}>
                        목록으로
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </AdminContainer>
    );
}

export default AdminInquiryDetailPage;
