import { useForm } from "react-hook-form";
import {
    type CreateReplyInputType,
    createReplySchema,
} from "../../schemas/reply/createReplySchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReplyContainer, ReplyForm, ReplyTitle } from "./reply.style.tsx";
import { LuMessageSquare } from "react-icons/lu";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import Button from "../common/button/Button.tsx";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import replyApi from "../../api/user/replyApi.ts";
import { useEffect } from "react";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
    // 사용자가 댓글 내용을 입력하고, 그걸 백엔드에게 저장해달라고 요청
    const { isLoggedIn } = useAuthStore();

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
            // TODO : 댓글 목록을 다시 불러와야 함
        } catch (error) {
            console.log("댓글 작성 실패 : ", error);
            alert("댓글 작성 중 오류가 발생했습니다.");
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
        </ReplyContainer>
    );
}

export default PostReply;
