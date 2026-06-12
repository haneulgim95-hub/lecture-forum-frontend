import type { Inquiry } from "../../types/inquiry.type.ts";

interface Props {
    inquiry?: Inquiry
}

function AdminInquiryAnswerBox({ inquiry }: Props) {
    return <>{inquiry?.answer}</>
}

export default AdminInquiryAnswerBox;