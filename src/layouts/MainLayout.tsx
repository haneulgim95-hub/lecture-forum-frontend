import { Outlet } from "react-router";
import styled from "styled-components";
import MainHeader from "../components/layout/main/MainHeader.tsx";
import MainFooter from "../components/layout/main/MainFooter.tsx";

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
            {/*// 메인부분이 화면의 전체가로길이를 차지하면 어색하다 (ex네이버 홈 참고)*/}
            <MainContainer>
                <Outlet />
            </MainContainer>
            <MainFooter />
        </LayoutWrapper>
    );
}

export default MainLayout;
