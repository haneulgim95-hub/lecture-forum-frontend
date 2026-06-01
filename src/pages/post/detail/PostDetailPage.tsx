import { useCallback, useEffect, useState } from "react";
import type { Post } from "../../../types/post.type.ts";
import { useNavigate, useParams } from "react-router";
import postApi from "../../../api/user/postApi.ts";
import {
    BattleGround,
    BattleTitle,
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
    ResultBar,
    ResultBarWrapper,
    ResultSection,
    ResultText,
    RevoteButton,
    VoteCard,
    VoteSection,
} from "../../../components/post/post.style.tsx";
import { useAuthStore } from "../../../stores/auth/authStore.ts";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import { GiCrossedSwords } from "react-icons/gi";
import { LuDroplet, LuFlame, LuRotateCcw } from "react-icons/lu";

function PostDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVoting, setIsVoting] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const { user, isLoggedIn } = useAuthStore();

    const loadPost = useCallback(async () => {
        try {
            const data = await postApi.fetchPostById(Number(id));
            setPost(data);
        } catch (error) {
            console.log(error);
            alert("게시글을 불러오는 중 오류가 발생했습니다.");
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    },[id, navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadPost().then(() => {});
    }, [id, loadPost]);

    const handleVote = async (option: number) => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        setIsVoting(true);

        try {
            await postApi.votePost(Number(id), option);
            await loadPost();
        } catch (error) {
            console.log("투표 실패: ", error);
            alert("투표 처리 중 오류가 발생했습니다.");
        } finally {
            setIsVoting(false);
        }
    };

    const handleCancelVote = async () => {
        if (!confirm("투표를 취소하고 다시 선택하시겠습니까")) {
            return;
        }

        setIsCanceling(true);

        try {
            await postApi.cancelVotePost(Number(id));
            await loadPost();
        } catch (error) {
            console.log(error);
            alert("투표를 취소하는 중 오류가 발생했습니다.");
        } finally {
            setIsCanceling(false);
        }
    };

    if (!post) return;

    const hasVoteSystem = !!post.option1Text && !!post.option2Text;

    const totalVotes = post.vote?.totalCount || 0;

    const opt1Percent = totalVotes > 0 && post.vote? Math.round((post.vote.option1Count / totalVotes) * 100) : 50;
    const opt2Percent = totalVotes > 0 && post.vote? Math.round((post.vote.option2Count / totalVotes) * 100) : 50;

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>글 내용을 불러오는 중입니다..</LoadingText>
            </PostContainer>
        );
    }

    return (
        <PostContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailTitle>{post.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>
                                <b>{post.user.nickname}</b>
                            </span>
                            <span>
                                {new Date(post.createdAt).toLocaleString("ko-kr", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className={"right-info"}>
                            <span>조회 {post.views}</span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                <DetailContent>{post.content}</DetailContent>

                {hasVoteSystem && post.vote && (
                    <BattleGround>
                        <BattleTitle>
                            <GiCrossedSwords size={24} color={"#EF4444"} />
                            당신의 선택은?
                        </BattleTitle>

                        {/* 현재 사용자가 투표를 했을 때 / 안 했을 때 */}
                        {post.vote.hasVoted ? (
                            <ResultSection>
                                <ResultBarWrapper>
                                    <ResultBar $color={"#EF4444"} $width={`${opt1Percent}%`}>
                                        <span className={"label"}>
                                            <LuFlame /> {post.option1Text}
                                        </span>
                                        <span className={"percent"}>
                                            {opt1Percent}% ({post.vote.option1Count}명)
                                        </span>
                                    </ResultBar>
                                    <ResultBar $color={"#3B82F6"} $width={`${opt2Percent}%`}>
                                        <span className={"label"}>
                                            <LuDroplet /> {post.option2Text}
                                        </span>
                                        <span className={"percent"}>
                                            {opt2Percent}% ({post.vote.option2Count}명)
                                        </span>
                                    </ResultBar>
                                </ResultBarWrapper>
                                <ResultText>소중한 한 표가 전황에 반영되었습니다.</ResultText>

                                <RevoteButton onClick={handleCancelVote} disabled={isCanceling}>
                                    <LuRotateCcw size={16} />
                                    다시 투표하기
                                </RevoteButton>
                            </ResultSection>
                        ) : (
                            <VoteSection>
                                <VoteCard
                                    $color={"#EF4444"}
                                    onClick={() => handleVote(1)}
                                    disabled={isVoting}>
                                    <LuFlame size={32} />
                                    <h3>{post.option1Text}</h3>
                                    <p>클릭하여 1번에 투표</p>
                                </VoteCard>
                                <VoteCard
                                    $color={"#3B82F6"}
                                    onClick={() => handleVote(2)}
                                    disabled={isVoting}>
                                    <LuDroplet size={32} />
                                    <h3>{post.option2Text}</h3>
                                    <p>클릭하여 2번에 투표</p>
                                </VoteCard>
                            </VoteSection>
                        )}
                    </BattleGround>
                )}

                <AdminButtonGroup>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                    {user?.id === post.user.id && (
                        <>
                            <Button color={"warning"} variant={"contained"}>
                                수정
                            </Button>
                            <Button color={"error"} variant={"contained"}>
                                삭제
                            </Button>
                        </>
                    )}
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default PostDetailPage;
