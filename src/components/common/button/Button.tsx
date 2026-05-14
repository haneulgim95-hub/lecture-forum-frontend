import styled from "styled-components";
import type {ButtonHTMLAttributes, ElementType, ReactNode } from "react";

export type ButtonColorType = "primary" | "secondary" | "success" | "error" | "warning" | "info";
export type ButtonVariantType = "contained" | "text" | "icon";

const StyledButton = styled.button<{
    $color: ButtonColorType;
    $variant: ButtonVariantType;
    $fullWidth?: boolean;
}>`
    width: ${props=> props.$fullWidth? "100%" : "auto"};
    font-size: 14px;
    font-weight: 600;
    color: ${props => (props.$variant === "contained" ? "#ffffff" : "inherit")};
    background-color: ${props =>
        props.$variant === "contained" ? props.theme.colors[props.$color] : "transparent"};
    padding: ${props => (props.$variant === "icon" ? "8px" : "8px 12px")};
    border-radius: ${props => (props.$variant === "icon" ? "50%" : "6px")};
    transition: all 0.5s;

    &:hover {
        // 밝기 조절
        filter: brightness(0.8);
        background-color: ${props =>
            props.$variant === "contained" ? undefined : props.theme.colors.background.default};
    }
`;

// 우리가 만든 Button 컴포넌트는 button 태그처럼 사용할꺼야
// 그러니깐 button 태그가 받을 수 있는 속성을 다 허용해줘. => 상속을 이용(interface)
// button 태그의 타입: ButtonHTMLAttributes<HTMLButtonElement>

// 즉 우리가 만든 Button 컴포넌트는 button의 확장판이다.

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    color: ButtonColorType;
    variant: ButtonVariantType;
    fullWidth?: boolean;
    as?: ElementType;
    to?: string;
}

function Button({children, color, variant, fullWidth, ...props} : Props) {
    return <StyledButton $color={color} $variant={variant} $fullWidth={fullWidth} {...(props as any)}>{children}</StyledButton>;
}

export default Button;