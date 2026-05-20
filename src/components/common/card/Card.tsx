import styled from "styled-components";
import type { ReactNode } from "react";

type CardProps = {
    children: ReactNode;
    padding?: string;
}

function Card({children, padding = "32px"}: CardProps) {
    return <StyledCard $padding={padding}>{children}</StyledCard>;
}

export default Card;

const StyledCard = styled.div<{$padding?: string}>`
    background-color: ${props => props.theme.colors.background.paper};
    border: 1px solid ${props => props.theme.colors.divider};
    border-radius: 12px;
    padding: ${props => props.$padding};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;