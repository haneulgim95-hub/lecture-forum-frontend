import { RouterProvider } from "react-router";
import GetRouter from "./router/GetRouter.tsx";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/theme.ts";
import { GlobalStyle } from "./styles/GlobalStyle.tsx";
import { useThemeStore } from "./stores/theme/themeStore.ts";
import AuthProvider from "./providers/auth/AuthProvider.tsx";

function App() {
    const { theme } = useThemeStore();
    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            <GlobalStyle />
            {/*💡 한 줄 요약 // 가장 꼭대기(App)에서 화면 프로바이더(Router)를 감싸주어야, 어느*/}
            {/*페이지로 접속하든 화면이 뜨기 전에 로그인 상태를 먼저 올바르게 체크할 수 있기*/}
            {/*때문입니다.*/}
            <AuthProvider>
                <RouterProvider router={GetRouter}></RouterProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;

// 1. 프로그램 내부 전체에서 로그인을 유지하기 위해 zustand를 사용함
// 2. 이 사람이 프로그램을 껐다가 다시 들어와도 로그인이 유지되게 하고 싶어서 localStorage 연결
// 3. token 정보가 백엔드에서 1일만 유지되도록 제한하고 있는게 문제가 된다.!!

// 이 사이트가 처음 열렸을 때 (App.tsx)
// 1. AuthStore에 token이 있는가??
// 2. 만약 token이 있따면, 백엔드에게 물어봐야 됨. " 이거 정상이야?"
// 3. 백엔드가 "아니"라고 대답하면, token과 user를 삭제하고, isLoggedIn을 false로 바꿔줘야 한다.