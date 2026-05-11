import styled from "styled-components";
import MainFooter from "../components/layout/MainFooter.tsx";
import MainHeader from "../components/layout/MainHeader.tsx";
import { Outlet } from "react-router";

const LayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
`;

const MainContainer = styled.div`
    flex: 1;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    // 모바일 처럼 화면이 줄어들었을 때 화면에 딱 붙지 않도록
    padding: 40px 20px;
`;

function MainLayout() {
    return (
        <LayoutWrapper>
            <MainHeader />
            <MainContainer>
                <Outlet />
            </MainContainer>
            <MainFooter />
        </LayoutWrapper>
    );
}

export default MainLayout;
