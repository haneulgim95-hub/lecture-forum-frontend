import {create} from "zustand";
import {persist} from "zustand/middleware";

type ThemeType = "light" | "dark";

type ThemeState = {
    theme: ThemeType,
    onChangeTheme: VoidFunction
}

export const useThemeStore = create<ThemeState>()(
    persist(
        set => ({
            theme: "light",
            onChangeTheme: () => set(state => ({theme: state.theme === "light" ? "dark" : "light"})),
        })
        ,
        {
            name: "theme-store"
        }
    )
);