import Input from "./Input.tsx";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { InputHTMLAttributes } from "react";
import { ErrorMessage, Label, StyledInputGroup } from "../group/Group.tsx";

interface Props extends InputHTMLAttributes<HTMLInputElement>{
    label?: string;
    id?: string;
    errorMessage?: string;
    registerObj?: UseFormRegisterReturn; 
}

function InputGroup({label, id, errorMessage, registerObj, ...props} : Props) {
    return(
        <StyledInputGroup>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input id={id} $hasError={!!errorMessage} {...registerObj} {...props}></Input>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </StyledInputGroup>
        )

}

export default InputGroup;
