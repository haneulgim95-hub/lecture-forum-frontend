import styled from "styled-components";
import { type ReactNode } from "react";

type CardProps = {
    children: ReactNode;
    padding?: string;
}

function Card({ children, padding = "32px"}: CardProps) {
    return <StyledCard $padding={padding}>{children}</StyledCard>;
}

const StyledCard = styled.div<{$padding?: string}>`
    padding: ${props => props.$padding};
    border: ${props => props.theme.colors.divider};
    background-color: ${props => props.theme.colors.background.paper};
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export default Card;