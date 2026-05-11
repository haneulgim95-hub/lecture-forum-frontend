import styled from "styled-components";
import type {ReactNode} from "react";

export type ButtonColorType = "primary" | "secondary" | "success" | "error" | "warning" | "info";
export type ButtonVariantType = "contained" | "text";

const StyledButton = styled.button<{$color: ButtonColorType, $variant: ButtonVariantType}>`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.$variant === "text" ? "inherit" : "#ffffff"};
    background-color: ${props => props.$variant === "text" ? "transparent" : props.theme.colors[props.$color]};
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.5s;

    &:hover {
        // 밝기 조절
        filter: brightness(0.8);
        background-color: ${props => props.$variant === "text" ? props.theme.colors.background.default : undefined}
    }
`;

type Props = {
    children: ReactNode;
    color: ButtonColorType;
    variant: ButtonVariantType;
}

function Button({children, color, variant} : Props) {
    return <StyledButton $color={color} $variant={variant}>{children}</StyledButton>;
}

export default Button;