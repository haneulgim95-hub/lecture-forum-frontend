// contextAPI의 단점을 보완하기 위해서..
// 노션의 react/ 상태관리 부분의 내용 참조할것
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

// 이건 "onChangeTheme의 초기값" 이 아니고,
//     onChangeTheme라는 함수 자체를 저장하는 거야.
//
//     차근차근 뜯어보면:
//
//     persist(
//         set => ({
//             theme: "light",
//
//             onChangeTheme: () =>
//                 set(state => ({
//                     theme: state.theme === "light" ? "dark" : "light"
//                 })),
//         }),
//     )
//
// 여기서 set => ({ ... }) 는:
//
//     (set) => {
//         return {
//             theme: "light",
//             onChangeTheme: ...
//         }
//     }
//
// 이 뜻이야.
//
//     즉 최종적으로 store 안에는 이런 객체가 들어감:
//
// {
//     theme: "light",
//         onChangeTheme: 함수
// }
// 그럼 onChangeTheme는 뭐냐?
//     onChangeTheme: () => ...
//
// 이건 함수 저장한 거야.
//
//     즉:
//
// onChangeTheme()
//
// 를 실행하면 뒤의 코드가 실행됨.
//
//     함수 실행 흐름
// 1단계
// onChangeTheme: () =>
//
//     "아무것도 안 받는 함수 하나 만들겠다"
//
// 2단계
// set(...)
//
// 그 함수 안에서 zustand의 set 호출.
//
//     set은 store 값을 바꾸는 명령어.
//
// 3단계
// set(state => ...)
//
// 여기서 state는 현재 store 상태.
//
//     예를 들어 지금 상태가:
//
// {
//     theme: "light"
// }
//
// 라고 해보자.
//
// 4단계
// ({
//     theme: state.theme === "light" ? "dark" : "light"
// })
//
// 현재 theme이 light면 dark로,
//     dark면 light로 바꾼 새 객체를 반환.
//
//     즉 결과:
//
// {
//     theme: "dark"
// }
// zustand가 이걸 어떻게 쓰냐?
//
//     zustand는 이 반환 객체를 기존 state에 합쳐줌.
//
//     기존:
//
// {
//     theme: "light",
//         onChangeTheme: 함수
// }
//
// 업데이트 객체:
//
// {
//     theme: "dark"
// }
//
// 최종:
//
// {
//     theme: "dark",
//         onChangeTheme: 함수
// }
//
// 이렇게 됨.
//
//     진짜 핵심
//
// 네가 헷갈린 부분:
//
//     "이 객체가 onChangeTheme의 초기값이 되는건가?"
//
// ❌ 아님
//
// 정확히는:
//
//     onChangeTheme의 값은 "함수"
// 그 함수 안에서 set(...)을 호출
// set(...) 안에서 반환한 객체는 "store를 어떻게 바꿀지"를 의미
//
// 이거야.
//
//     이해 쉽게 축약하면
//
// 사실 그냥 이런 코드랑 거의 같아:
//
//     const store = {
//         theme: "light",
//
//         onChangeTheme() {
//             if (store.theme === "light") {
//                 store.theme = "dark";
//             } else {
//                 store.theme = "light";
//             }
//         }
//     }
//
// zustand는 이걸 React스럽게 안전하게 만든 버전이라고 보면 돼.
