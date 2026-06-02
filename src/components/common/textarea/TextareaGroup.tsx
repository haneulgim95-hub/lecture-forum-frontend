import { ErrorMessage, Label, StyledInputGroup } from "../group/Group.tsx";
import type { CSSProperties, TextareaHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import Textarea from "./Textarea.tsx";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    id?: string;
    errorMessage?: string;
    // register를 실행하면 만들어지는 결과가 들어갈수 있는 타입
    registerObj?: UseFormRegisterReturn;
    style?: CSSProperties;
}

function TextareaGroup({ label, id, errorMessage, registerObj,style, ...props }: Props) {
    return (
        <StyledInputGroup style={style}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Textarea id={id} $hasError={!!errorMessage} {...registerObj} {...props} />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </StyledInputGroup>
    );
}

export default TextareaGroup;