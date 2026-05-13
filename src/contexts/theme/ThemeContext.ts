import { createContext } from "react";

export type ThemeType = "light" | "dark";

export type ThemeContextType = {
    theme: ThemeType;
    onChangeTheme: VoidFunction;
};

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    onChangeTheme: () => {}
});