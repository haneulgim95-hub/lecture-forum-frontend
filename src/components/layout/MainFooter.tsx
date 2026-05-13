import styled from "styled-components";

const FooterContainer = styled.footer`
    border-top: 1px solid ${props => props.theme.colors.divider};
    background-color: ${props => props.theme.colors.background.paper};
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
function MainFooter() {
    return (
        <FooterContainer>
            <p>Copyright 2026 My Website</p>
        </FooterContainer>
    );
}

export default MainFooter;
