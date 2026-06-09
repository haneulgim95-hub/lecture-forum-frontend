import { useEffect, useState } from "react";
import type { Notice } from "../../../types/notice.type.ts";
import { useNavigate, useParams } from "react-router";
import noticeApi from "../../../api/user/noticeApi.ts";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../components/post/post.style.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";

function NoticeDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadNotice = async () => {
            try {
                const data = await noticeApi.getNoticeById(Number(id));
                setNotice(data);
            } catch (error) {
                console.log("공지사항 상세 조회 실패: ", error);
                alert("공지사항 조회를 하는 중 오류가 발생했습니다.");
                navigate("/notice");
            } finally {
                setIsLoading(false);
            }
        };
        loadNotice().then(() => {});
    }, [id, navigate]);

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>글 내용을 불러오는 중입니다...</LoadingText>
            </PostContainer>
        );
    }

    if (!notice) return;

    return (
        <PostContainer>
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

                <AdminButtonGroup style={{ marginTop: "40px"}}>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default NoticeDetailPage;
