import { ThemeProvider } from "styled-components";
import { LightTheme } from "./styles/theme.ts";
import { RouterProvider } from "react-router";
import GetRouter from "./router/GetRouter.tsx";
import { GlobalStyle } from "./styles/GlobalStyle.tsx";

function App() {
    return (
        <ThemeProvider theme={LightTheme}>
            <GlobalStyle/>
            <RouterProvider router={GetRouter}></RouterProvider>
        </ThemeProvider>
    );
}

export default App;
