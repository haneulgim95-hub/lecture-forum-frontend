import { useEffect, useState } from "react";
import type { Notice } from "../../../../types/notice.type.ts";
import { Link, useNavigate, useParams } from "react-router";
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
import AdminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";

function AdminNoticeDetailPage_Mine() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return (
            <AdminContainer>
                <LoadingText>글 내용을 불러오는 중입니다.</LoadingText>
            </AdminContainer>
        );
    }

    if (!notice) return;

    const handleDeleteNotice = async (id: number) => {
        if (!confirm("정말로 공지사항을 삭제 하시겠습니까?")) return;

        try {
            await AdminNoticeApi.deleteNotice(id);
            alert("공지사항이 성공적으로 삭제되었습니다.");
            navigate("/admin/notice");
        } catch (error) {
            console.log("공지사항 삭제 실패 : ", error);
            alert("공지사항을 삭제하는데 실패했습니다.");
        }
    };

    return (
        <AdminContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailTitle>{notice.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            {new Date(notice.createdAt).toLocaleString("ko-kr", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })}
                        </div>
                        <div className={"right-info"}>id : {notice.id}</div>
                    </DetailInfo>
                </DetailHeader>
                <DetailContent>{notice.content}</DetailContent>

                <AdminButtonGroup>
                    <Button
                        color={"secondary"}
                        variant={"contained"}
                        onClick={() => navigate("/admin/notice")}>
                        목록으로
                    </Button>
                    <Button color={"warning"} variant={"contained"} as={Link} to={`/admin/notice/${notice.id}/edit`}>
                        수정
                    </Button>
                    <Button color={"error"} variant={"contained"} onClick={() => handleDeleteNotice(notice.id)}>
                        삭제
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </AdminContainer>
    );
}

export default AdminNoticeDetailPage_Mine;
