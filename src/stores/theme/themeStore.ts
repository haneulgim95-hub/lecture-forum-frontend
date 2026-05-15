// contextAPI의 단점을 보완하기 위해서..
// 노션의
// - 사용하는 방법
// - store(스토어) : 전역에서 사용할 수 있도록 메모리에 마련한 저장소
// 1. 스토어를 마련 -> themeStore.ts에서
// 2. 스토어를 사용 -> App.tsx 와 MainHeader.tsx
// 이걸 하고 나면 context폴더는 삭제해줘도 된다!

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeType = "light" | "dark";

type ThemeState = {
    theme: ThemeType;
    onChangeTheme: VoidFunction;
};

export const useThemeStore = create<ThemeState>()(
    // persist는 이렇게 마련한 store와 localStorage를 연결하는 미들웨어
    // persist 를 사용하면 localStorage에 자동 저장 / 불러오기 기능이 추가됨
    // create<스토어의 타입>()(persist)
    // persist(초기값, localStorage의 설정)

    // 초기값을 함수로 넣었고, (스토어의 값을 바꿀 수 있는 명령:set) => ({ theme, onChangeTheme })
    persist(
        set => ({
            theme: "light",
            onChangeTheme: () =>
                set(state => ({ theme: state.theme === "light" ? "dark" : "light" })),
        }),
        {
            name: "theme-storage",
        },
    ),
);

// 소괄호를 두번 치는 이유 :
// create<ThemeState>()를 실행하고 나온 결과, 그 결과를 또 실행 => ()()

// function sum(z, y) {
//     return (x) => z * x;
// }

// sum(3,4) => (x) => 3 * x
// sum(3,4)(3) => 9

// const result = sum(3,4)
// result(3) => 9
