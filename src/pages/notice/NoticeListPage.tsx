import { useEffect, useState } from "react";
import type { Notice } from "../../types/notice.type.ts";
import { Link, useNavigate, useSearchParams } from "react-router";
import noticeApi from "../../api/user/noticeApi.ts";
import {
    BoardTable,
    BoardTd,
    BoardTh,
    BoardWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../components/post/post.style.tsx";
import Pagination from "../../components/common/pagination/Pagination.tsx";

function NoticeListPage() {
    const navigate = useNavigate();
    const [list, setList] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("page")) || 10;
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / size);

    useEffect(() => {
        const loadList = async () => {
            try {
                const data = await noticeApi.getNoticeList(page, size);
                setList(data.list);
                setTotal(data.total);
            } catch (error) {
                console.log("공지사항 목록 조회 실패: ", error);
                alert("공지사항을 불러오는 중 오류가 발생했습니다.");
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        };
        window.scrollTo({ top: 0, behavior: "smooth" });
        loadList().then(() => {});
    }, [navigate, page, size]);

    const handlePageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams);
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    공지사항 <small>총 {total}개의 글</small>
                </PostTitle>
            </PostPageHeader>

            <BoardWrapper>
                {isLoading ? (
                    <LoadingText>공지사항을 불러오는 중입니다...</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width={"15%"}>번호</BoardTh>
                                <BoardTh>제목</BoardTh>
                                <BoardTh $width={"20%"}>작성일</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 && (
                                <tr>
                                    <BoardTd colSpan={3} style={{ padding: "100px 0" }}>
                                        아직 작성된 공지사항이 없습니다.
                                    </BoardTd>
                                </tr>
                            )}
                            {list.map(item => (
                                <tr key={item.id}>
                                    <BoardTd>{item.id}</BoardTd>
                                    <BoardTd className={"title-cell"}>
                                        <Link to={`/notice/${item.id}`}>{item.title}</Link>
                                    </BoardTd>
                                    <BoardTd>
                                        {new Date(item.createdAt).toLocaleString("ko-kr", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </BoardTd>
                                </tr>
                            ))}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>

            <Pagination currentPage={page} totalPage={totalPage} onPageChange={handlePageChange} />
        </PostContainer>
    );
}

export default NoticeListPage;
