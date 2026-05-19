import styled, { css } from "styled-components";
import type { ReactNode } from "react";

type BadgeColorType =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "default";

type BadgeProps = {
    children: ReactNode;
    color?: BadgeColorType;
};

function Badge({ children, color = "default" }: BadgeProps) {
    return <StyledBadge $color={color}>{children}</StyledBadge>;
}

export default Badge;

const StyledBadge = styled.span<{ $color?: BadgeColorType }>`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;

    ${({ $color, theme }) => {
        switch ($color) {
            case "primary":
                return css`
                    background-color: ${theme.colors.primary}20;
                    color: ${theme.colors.primary};
                `;
            case "secondary":
                return css`
                    background-color: ${theme.colors.secondary}20;
                    color: ${theme.colors.secondary};
                `;
            case "success":
                return css`
                    background-color: ${theme.colors.success}20;
                    color: ${theme.colors.success};
                `;
            case "error":
                return css`
                    background-color: ${theme.colors.error}20;
                    color: ${theme.colors.error};
                `;
            case "warning":
                return css`
                    background-color: ${theme.colors.warning}20;
                    color: ${theme.colors.warning};
                `;
            case "info":
                return css`
                    background-color: ${theme.colors.info}20;
                    color: ${theme.colors.info};
                `;
            case "default":
                return css`
                    background-color: ${theme.colors.divider}20;
                    color: ${theme.colors.text.disabled};
                `;
        }
    }}
`;
