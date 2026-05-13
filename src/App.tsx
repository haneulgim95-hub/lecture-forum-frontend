import { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router";
import GetRouter from "./router/GetRouter.tsx";
import { GlobalStyle } from "./styles/GlobalStyle.tsx";
import { useEffect, useState } from "react";
import { ThemeContext, type ThemeType } from "./contexts/theme/ThemeContext.tsx";
import { darkTheme, lightTheme } from "./styles/theme.ts";

function App() {

    const [theme, setTheme] = useState<ThemeType>(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark" ? "dark" : "light";
    });

    const onChangeTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, onChangeTheme }}>
            <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
                <GlobalStyle />
                <RouterProvider router={GetRouter}></RouterProvider>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default App;

// ContextAPI 단점
// useState와 마찬가지로, 휘발성 저장소이기 때문에 앱이 닫히면 데이터도 사라짐
// ContextAPI 사용처
// Props의 전달하는 단계가 너무 많아질 때
// A루트 뿐만 아니라 B루트에도 전달되어야 할 때 (즉, App 단계에서 관리해야 하는 데이터일 때)
