import { useEffect, useState } from "react";
import type { Inquiry } from "../../../types/inquiry.type.ts";
import { Link, useSearchParams } from "react-router";
import inquiryApi from "../../../api/user/inquiryApi.ts";
import {
    BoardTable,
    BoardTd,
    BoardTh,
    BoardWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../components/post/post.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import Badge from "../../../components/common/badge/Badge.tsx";
import Pagination from "../../../components/common/pagination/Pagination.tsx";

function MyInquiryListPage() {
    const [list, setList] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("page")) || 20;
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / size);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const loadList = async () => {
            try {
                const result = await inquiryApi.fetchMyInquiryList(page, size);
                setList(result.list);
                setTotal(result.total);
            } catch (error) {
                console.log("나의 문의글 목록 조회 실패 : ", error);
                alert("나의 문의글 목록을 조회하는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        loadList().then(() => {});
    }, [page, size]);

    const handlePageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams);
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    나의 문의글 <small>총 {total}개의 글</small>
                </PostTitle>
                <Button color={"primary"} variant={"contained"} as={Link} to={"/my/inquiry/create"}>
                    문의 남기기
                </Button>
            </PostPageHeader>

            <BoardWrapper>
                {isLoading ? (
                    <LoadingText>게시글을 불러오는 중입니다.</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width={"10%"}>번호</BoardTh>
                                <BoardTh>제목</BoardTh>
                                <BoardTh $width={"20%"}>작성일</BoardTh>
                                <BoardTh $width={"20%"}>답변</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 && (
                                <tr>
                                    <BoardTd colSpan={4} style={{ padding: "100px 0" }}>
                                        아직 작성된 문의글이 없습니다.
                                    </BoardTd>
                                </tr>
                            )}
                            {list.map(item => (
                                <tr key={item.id}>
                                    <BoardTd>{item.id}</BoardTd>
                                    <BoardTd>
                                        <Link to={`/my/inquiry/${item.id}`}>{item.title}</Link>
                                    </BoardTd>
                                    <BoardTd>
                                        {new Date(item.createdAt).toLocaleString("ko-kr", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </BoardTd>
                                    <BoardTd>
                                        <Badge color={item.answer ? "success" : "default"}>
                                            {item.answer ? "답변완료" : "답변대기"}
                                        </Badge>
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

export default MyInquiryListPage;
