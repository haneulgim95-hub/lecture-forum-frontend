// d.ts파일은 이미 존재하는 타입에대해서 재정의할때 사용
// 프로그램을 실행할 때 자동으로 불러온다.
import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            background: {
                default: string;
                paper: string
            };
            text: {
                default: string;
                disabled: string
            };
            divider: string;
            primary: string;
            secondary: string;
            success: string;
            error: string;
            warning: string;
            info: string;
        }
    }
}