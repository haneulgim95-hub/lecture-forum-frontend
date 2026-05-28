import { useEffect, useState } from "react";
import type { Post } from "../../types/post.type.ts";
import postApi from "../../api/user/postApi.ts";
import { Link, useParams, useSearchParams } from "react-router";
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
import Button from "../../components/common/button/Button.tsx";
import { useAuthStore } from "../../stores/auth/authStore.ts";

function PostListPage() {
    const { isLoggedIn } = useAuthStore();

    const {id} = useParams();
    const [list, setList] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const size = Number(searchParams.get("size")) || 20;
    const page = Number(searchParams.get("page")) || 1;
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / size);

    useEffect(() => {
        const loadList = async () => {
            try {
                const postList = await postApi.fetchPostListByCategory(Number(id), size, page);
                setList(postList.list);
                setTotal(postList.total);
            } catch (error) {
                console.log(error);
                alert("게시글 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadList().then(() => {});
    }, [id, page, size]);

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    게시판 <small>총 {total}개의 글</small>
                </PostTitle>
                {isLoggedIn && (
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        as={Link}
                        to={`/post/create/${id}`}>
                        글쓰기
                    </Button>
                )}
            </PostPageHeader>

            <BoardWrapper>
                {loading ? (
                    <LoadingText>게시글을 불러오는 중입니다.</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width={"10%"}>번호</BoardTh>
                                <BoardTh>제목</BoardTh>
                                <BoardTh $width={"15%"}>작성자</BoardTh>
                                <BoardTh $width={"15%"}>작성일</BoardTh>
                                <BoardTh $width={"10%"}>조회수</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 && (
                                <tr>
                                    <BoardTd colSpan={5} style={{ padding: "100px 0" }}>
                                        아직 작성된 게시글이 없습니다. 첫 글을 남겨보세요!
                                    </BoardTd>
                                </tr>
                            )}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>
        </PostContainer>
    );
}

export default PostListPage;