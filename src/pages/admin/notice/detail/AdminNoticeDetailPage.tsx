import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Notice } from "../../../../types/notice.type.ts";
import noticeApi from "../../../../api/user/noticeApi.ts";
import { AdminButtonGroup, AdminContainer } from "../../../../components/admin/admin.style.tsx";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
} from "../../../../components/post/post.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import adminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";

function AdminNoticeDetailPage() {
    const navigate = useNavigate();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;
        const loadNotice = async () => {
            try {
                const data = await noticeApi.getNoticeById(Number(id));
                setNotice(data);
            } catch (error) {
                console.log("공지사항 상세 조회 실패 : ", error);
                alert("공지사항 상세를 불러오는 중 오류가 발생했습니다.");
                navigate("/admin/notice");
            } finally {
                setIsLoading(false);
            }
        };
        loadNotice().then(() => {});
    }, [id, navigate]);

    const handleDeleteNotice = async () => {
        if (!window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

        try {
            await adminNoticeApi.deleteNotice(Number(id));
            navigate("/admin/notice");
        } catch (error) {
            console.log("공지사항 삭제 실패: ", error);
            alert("공지사항 삭제 중 오류가 발생했습니다.");
        }
    };

    if (isLoading) {
        return (
            <AdminContainer>
                <LoadingText>공지사항 내용을 불러오는 중입니다.</LoadingText>
            </AdminContainer>
        );
    }

    // notice가 Notice | null이 허용되어 있는 state이기 때문
    if (!notice) return;

    return (
        <AdminContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailTitle>{notice.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>
                                {new Date(notice.createdAt).toLocaleString("ko-kr", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                <DetailContent>{notice.content}</DetailContent>

                <AdminButtonGroup style={{marginTop: "40px"}}>
                    <Button
                        color={"secondary"}
                        variant={"contained"}
                        onClick={() => navigate("/admin/notice")}>
                        목록으로
                    </Button>
                    <Button
                        color={"warning"}
                        variant={"contained"}
                        as={Link}
                        to={`/admin/notice/update/${notice.id}`}>
                        수정
                    </Button>
                    <Button
                        color={"error"}
                        variant={"contained"}
                        onClick={handleDeleteNotice}>
                        삭제
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </AdminContainer>
    );
}

export default AdminNoticeDetailPage;