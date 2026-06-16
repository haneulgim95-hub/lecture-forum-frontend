import { type PropsWithChildren, useEffect, useState } from "react";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import userApi from "../../api/user/userApi.ts";

// PropsWidthChildren 타입은 React 기본 제공 타입
// 자식 컴포넌트를 갖는 형태를 너무도 많이 쓰기 때문에 기본으로 제공 중

// type Props = {
//     width: string;
//     children: ReactNode;
// }

// 해당 타입을 확장해서 사용하는 방법은 interface일 경우 extends
// interface Props extends PropsWithChildren {
//     width: string;
// }

// type일 경우 & 연산자 사용
// type Props = PropsWithChildren & {width: string};

type Props = PropsWithChildren;

function AuthProvider({ children }: Props) {
    const { isLoggedIn, token, logout } = useAuthStore();
    const [isInitialized, setIsInitialized] = useState<boolean>(true);

    useEffect(() => {
        const checkAuthValidity = async () => {
            if (isLoggedIn && token) {
                try {
                    // 백엔드에게 내가 갖고 있는 토큰이 정상 토큰인지 확인 요청을 해야함
                    // 정상 토큰이면 백엔드로부터 사용자의 최신 정보를 받아온다
                    // 회사에서 사용하다가, 집에가서 사용자 정보를 업데이트 했을 수도 있다..
                    const result = await userApi.getMe();
                    useAuthStore.setState({ user: result });
                } catch (error) {
                    console.log(error);
                    // catch절이 실행된다는 이야기는, 백엔드에서 검증에 실패했다는 이야기임
                    // zustand에 있는 로그인 정보를 싸그리 날려줘야 한다!
                    logout();
                    // 로그인이 안된 사용자라면, 로그아웃을 할거라면, 메인화면으로 보내야되지 않나?
                    // 사실 로그아웃하고 RouterProvider가 실행 되었을때 /my/inquiry같은 로그인이 필요한 페이지로
                    // 사용자가 직접 주소창에 입력해서 넘어왔더라도, GetRouter가 loader에 의해 끊어주기 때문에. 굳이
                    // 메인화면으로 이동한다거나, 덧붙이는 내용이 없어도 무방함

                    // 로그인이 풀렸으면, 풀렸다는걸 알려주고 로그인 페이지로 보내야되겠다' 고 설계할수도 있다
                    // alert("로그인 세션이 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.");
                    // useNavigate("/auth/login");
                }
            }
            setIsInitialized(false);
        };
        checkAuthValidity().then(() => {});
    }, [isLoggedIn, logout, token]);

    if (isInitialized) {
        return null;
    }

    return <>{children}</>;
    // 화면이 하얀 상태에서 useEffect가 발동하고 로그아웃 처리 된 뒤에 화면이 그려지면 사용자는 그냥 받아들임
}

export default AuthProvider;
