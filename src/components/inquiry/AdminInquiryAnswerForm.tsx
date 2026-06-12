import { useForm } from "react-hook-form";
import {
    type InquiryAnswerInputType,
    inquiryAnswerSchema,
} from "../../schemas/inquiry/inquiryAnswerSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminButtonGroup, AdminForm } from "../admin/admin.style.tsx";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import Button from "../common/button/Button.tsx";
import adminInquiryApi from "../../api/admin/adminInquiryApi.ts";

interface Props {
    inquiryId: number;
    reload: () => Promise<void>;
}

function AdminInquiryAnswerForm({ inquiryId, reload }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<InquiryAnswerInputType>({
        resolver: zodResolver(inquiryAnswerSchema),
        mode: "onBlur",
    });

    const onSubmit = async (input: InquiryAnswerInputType) => {
        try {
            await adminInquiryApi.updateInquiryAnswer(inquiryId, input);
            alert("답변을 성공적으로 등록했습니다.");
            await reload();
        } catch (error) {
            console.log(error);
            alert("답변을 등록하는데 실패했습니다.");
        }
    };

    return (
        <AdminForm onSubmit={handleSubmit(onSubmit)}>
            <TextareaGroup
                label={"관리자 답변 작성"}
                id={"answer"}
                errorMessage={errors.answer?.message}
                registerObj={register("answer")}
                placeholder={"사용자에게 전달할 답변을 상세히 작성해주세요"}
            />

            <AdminButtonGroup>
                <Button type={"submit"} disabled={isSubmitting} color={"error"} variant={"text"}>
                    답변 등록
                </Button>
            </AdminButtonGroup>
        </AdminForm>
    );
}

export default AdminInquiryAnswerForm;
