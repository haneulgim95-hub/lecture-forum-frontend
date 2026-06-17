import {
    BattleGround,
    BattleTitle,
    ResultBar,
    ResultBarWrapper,
    ResultSection,
    ResultText,
    RevoteButton,
    VoteCard,
    VoteSection,
} from "./post.style.tsx";
import { LuDroplet, LuFlame, LuRotateCcw } from "react-icons/lu";
import { GiCrossedSwords } from "react-icons/gi";
import postApi from "../../api/user/postApi.ts";
import { useState } from "react";
import type { Post } from "../../types/post.type.ts";

interface Props {
    isLoggedIn: boolean;
    loadPost: () => Promise<void>;
    post: Post;
}

function PostVote({ isLoggedIn, loadPost, post }: Props) {
    const [isVoting, setIsVoting] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    if (!post.vote) return null;

    const totalVotes = post.vote?.totalCount || 0;

    const opt1Percent =
        totalVotes > 0 && post.vote ? Math.round((post.vote.option1Count / totalVotes) * 100) : 50;
    const opt2Percent =
        totalVotes > 0 && post.vote ? Math.round((post.vote.option2Count / totalVotes) * 100) : 50;

    const handleVote = async (option: number) => {
        if (!isLoggedIn) {
            alert("투표에 참여하려면 로그인이 필요합니다.");
            return;
        }

        setIsVoting(true);

        try {
            await postApi.createVote(post.id, option);
            await loadPost();
        } catch (error) {
            console.log(error);
            alert("투표를 진행하는 중 오류가 발생했습니다.");
        } finally {
            setIsVoting(false);
        }
    };

    const handleCancelVote = async () => {
        if (!confirm("투표를 취소하고 다시 선택하시겠습니까?")) return;

        setIsCanceling(true);

        try {
            await postApi.cancelVotePost(post.id);
            await loadPost();
        } catch (error) {
            console.log(error);
            alert("투표를 취소하는 중 오류가 발생했습니다.");
        } finally {
            setIsCanceling(false);
        }
    };

    return (
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
                    <VoteCard $color={"#EF4444"} onClick={() => handleVote(1)} disabled={isVoting}>
                        <LuFlame size={32} />
                        <h3>{post.option1Text}</h3>
                        <p>클릭하여 1번에 투표</p>
                    </VoteCard>
                    <VoteCard $color={"#3B82F6"} onClick={() => handleVote(2)} disabled={isVoting}>
                        <LuDroplet size={32} />
                        <h3>{post.option2Text}</h3>
                        <p>클릭하여 2번에 투표</p>
                    </VoteCard>
                </VoteSection>
            )}
        </BattleGround>
    );
}

export default PostVote;