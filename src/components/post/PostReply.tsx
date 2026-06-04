import { useForm } from "react-hook-form";
import {
    type CreateReplyInputType,
    createReplySchema,
} from "../../schemas/reply/createReplySchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    EmptyMessage,
    ReplyContainer,
    ReplyContent,
    ReplyForm,
    ReplyHeader,
    ReplyItem,
    ReplyList,
    ReplyTitle,
} from "./reply.style.tsx";
import { LuMessageSquare } from "react-icons/lu";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import Button from "../common/button/Button.tsx";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import replyApi from "../../api/user/replyApi.ts";
import { useCallback, useEffect, useState } from "react";
import type { Reply } from "../../types/reply.type.ts";
import ReplyPagination from "../common/pagination/ReplyPagination.tsx";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
    // 사용자가 댓글 내용을 입력하고, 그걸 백엔드에게 저장해달라고 요청
    const { isLoggedIn, user } = useAuthStore();
    const [list, setList] = useState<Reply[]>([]);

    // 댓글 목록을 포함해야 하니, pagination도 해야되는구나. 근데 얠 querystring에 포함 시켜야되나?
    // 사용자 목록 또는 글 목록을 할 떄에는 페이지네이션 정보를 쿼리스트링에 포함했었음
    // 근데 지금 보면, PostReply라고 하는 컴포넌트는 PostDetailPage의 하위 컴포넌트로 구상되어져 있음
    // 이 이야기는 지금 사용 중인 주소는 "PostDetailPage"가 출력되는 주소
    // 결국 여기에서 쿼리스트링을 쓰면 /post/7?page=1&size=10 이러한 결과가 됨
    // 이렇게 해도 됨
    // 근데 주소를 가지고 값을 따져보기엔 모호해짐. 즉 이건 직관적이지 못하다.
    // 그리고 쿼리스트링으로 관리하는 이유는 "뒤로가기" 때문에, 히스토리를 유지하기 위해 하는 것
    // 여기에서의 내 판단은 "글"이 중심이 되어야지 "댓글"이 중심은 아니다. 쿼리스트링을 안 쓸 것임

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const size = 10;
    const totalPage = Math.max(1, Math.ceil(total / size)); // 총 페이지 매 수 (total을 1로 대입해서 생각해보길..)
    const [isLoading, setIsLoading] = useState(true);

    const loadReplies = useCallback(
        async (page: number) => {
            // 함수 스코프에 의해서
            // 이 함수가 갖게 되는 page 변수는 부모가 갖고 있는 page state가 아니라 page 매개변수가 됨
            try {
                const result = await replyApi.getRepliesByPostId(postId, page, size);
                setList(result.list);
                setTotal(result.total);
                setPage(page);
            } catch (error) {
                console.log(error);
                // 부속품인데 댓글목록을 불러오는데 실패했다고 얘를 목록을 보내는건 이상하다.
            } finally {
                setIsLoading(false);
            }
        },
        [postId],
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadReplies(1).then(() => {});
    }, [loadReplies]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateReplyInputType>({
        resolver: zodResolver(createReplySchema),
        mode: "onBlur",
    });

    //  에러 원인: Zod 스키마는 postId를 필수로 요구하지만, 화면(JSX)엔 content 입력창만 등록되어 있어 postId가 누락된 채 제출되었습니다.
    //
    // 해결 원리: 렌더링 직후 useEffect가 실행되면서 reset({ postId })를 통해 RHF 내부 상태에 postId 값을 강제로 주입합니다.
    //
    // 결과: 이 덕분에 데이터가 온전해져서 제출(Submit) 시 RHF가 Zod에게 postId와 content를 모두 정상적으로 전달할 수 있게 됩니다.
    //
    // 추가 기능: 부모로부터 새로운 postId가 넘어올 때마다 useEffect가 다시 돌며 RHF 내부의 postId 상태를 최신 값으로 자동 갱신해 줍니다.

    useEffect(() => {
        reset({
            postId,
        });
    }, [postId, reset]);

    const onSubmit = async (data: CreateReplyInputType) => {
        try {
            await replyApi.createReply(postId, data.content);
            reset(); // textarea에 값이 입력되어져 있는 상태이기 때문에 그걸 비우려고
            // 1. 내가 댓글을 작성하면 실행
            // 2. 글내용을 보면, 이미 댓글 목록도 불러와졌어야 함
            await loadReplies(1);
        } catch (error) {
            console.log("댓글 작성 실패 : ", error);
            alert("댓글 작성 중 오류가 발생했습니다.");
        }
    };

    const handleDeleteReply = async (replyId: number) => {
        if (!confirm("정말 이 댓글을 삭제 하시겠습니까?")) return;

        try {
            await replyApi.deleteReply(replyId);
            await loadReplies(1);
        } catch (error) {
            console.log("댓글 삭제 실패: ", error);
            alert("댓글 삭제 중 오류가 발생되었습니다.");
        }
    };

    return (
        <ReplyContainer>
            <ReplyTitle>
                <LuMessageSquare size={28} />
                댓글 <span className={"count"}>0</span>
            </ReplyTitle>
            <ReplyForm onSubmit={handleSubmit(onSubmit)}>
                <div style={{ flex: 1 }}>
                    <TextareaGroup
                        style={{ minHeight: "40px" }}
                        placeholder={
                            isLoggedIn
                                ? "토론에 대한 의견을 남겨주세요"
                                : "로그인 후 댓글을 작성할 수 있습니다."
                        }
                        errorMessage={errors.content?.message}
                        registerObj={register("content")}
                        disabled={!isLoggedIn || isSubmitting}
                    />
                </div>
                <Button
                    disabled={!isLoggedIn || isSubmitting}
                    style={{ minWidth: "100px" }}
                    color={isLoggedIn ? "primary" : "secondary"}
                    variant={"contained"}
                    type={"submit"}>
                    {isSubmitting ? "등록 중..." : "댓글 등록"}
                </Button>
            </ReplyForm>

            <ReplyList>
                {isLoading ? (
                    <EmptyMessage>댓글을 불러오는 중입니다.</EmptyMessage>
                ) : list.length === 0 ? (
                    <EmptyMessage>가장 먼저 토론에 참여해보세요!</EmptyMessage>
                ) : (
                    list.map(item => (
                        <ReplyItem key={item.id}>
                            <ReplyHeader>
                                <div className={"author-info"}>
                                    <strong>{item.user.nickname}</strong>
                                    <span className={"date"}>
                                        {new Date(item.createdAt).toLocaleString("ko-kr", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                {user?.id === item.userId && (
                                    <button
                                        className={"delete-btn"}
                                        onClick={() => handleDeleteReply(item.id)}>
                                        삭제
                                    </button>
                                )}
                            </ReplyHeader>
                            <ReplyContent>{item.content}</ReplyContent>
                        </ReplyItem>
                    ))
                )}
            </ReplyList>

            <ReplyPagination currentPage={page} totalPage={totalPage} onPageChange={loadReplies} />
        </ReplyContainer>
    );
}

export default PostReply;
