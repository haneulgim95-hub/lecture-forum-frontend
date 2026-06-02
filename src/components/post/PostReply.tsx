import { ReplyContainer, ReplyForm, ReplyTitle } from "./reply.style.tsx";
import { LuMessageSquare } from "react-icons/lu";
import {
    type CreateReplyInputType,
    createReplySchema,
} from "../../schemas/reply/createReplySchema.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import Button from "../common/button/Button.tsx";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import replyApi from "../../api/user/replyApi.ts";
import { useEffect } from "react";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
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

    useEffect(() => {
        reset({
            postId,
        })
    }, [postId, reset])

    const onSubmit = async (data: CreateReplyInputType) => {
        try {
            await replyApi.createReply(postId, data.content);
            reset();
        } catch (error) {
            console.log(error);
            alert("댓글 등록에 실패했습니다.");
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
                        disabled={isSubmitting || !isLoggedIn}
                        style={{ width: "100%" }}
                        errorMessage={errors.content?.message}
                        registerObj={register("content")}
                        placeholder={
                            isLoggedIn
                                ? "토론에 대한 의견을 남겨주세요"
                                : "로그인 후 댓글을 작성할 수 있습니다."
                        }
                    />
                </div>
                <Button
                    type={"submit"}
                    color={isLoggedIn ? "primary" : "secondary"}
                    variant={"contained"}
                    disabled={isSubmitting || !isLoggedIn}>
                    {isSubmitting ? "등록중..." : "댓글 등록"}
                </Button>
            </ReplyForm>
        </ReplyContainer>
    );
}

export default PostReply;
