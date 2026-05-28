import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요.").max(255, "제목은 255자를 넘을 수 없습니다."),
    content: z.string().min(1, "내용을 입력해주세요."),
    categoryId: z.number().positive("유효한 카테고리 ID가 필요합니다."), // 카테고리Id를 경로가 아닌, body에서 받겠다
    option1Text: z.string().max(50, "투표 선택지 내용은 50자 이하로 입력해주세요.").optional(), // 있어도 되고, 없어도 되고
    option2Text: z.string().max(50, "투표 선택지 내용은 50자 이하로 입력해주세요.").optional(),
}).refine(data=>{
    const hasOpt1 = !!data.option1Text?.trim();
    const hasOpt2 = !!data.option2Text?.trim();
    return hasOpt1 && hasOpt2;
},{
    path: ["root"],
    message: "투표 기능을 사용하려면 1번과 2번 항목을 모두 입력해야 합니다.",
})

export type CreatePostInputType = z.infer<typeof createPostSchema>;
