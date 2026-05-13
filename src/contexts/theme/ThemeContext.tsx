import {createContext} from "react";

export type ThemeType = "light" | "dark";

export type ThemeContextType = {
    theme: ThemeType;
    onChangeTheme: VoidFunction;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    onChangeTheme: () => {},
});

//사실 이렇게 마련한 ThemeContext의 초기값들은 쓸모가 없음
// 그 저장소의 Type만 맞춰서 값을 집어넣은 것 (dumy)