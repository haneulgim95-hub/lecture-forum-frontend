// react-hook-form을 사용 할것인가 안할것인가??
// react-hook-form을 사용할 것이면 schema를 만들어서 zod에게 검증 내용을 알려준다.

import { type SignInInputType, signInSchema } from "../../../schemas/auth/signInSchema.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/common/button/Button.tsx";
import axiosInstance from "../../../api/axiosInstance.ts";
import { useNavigate } from "react-router";
import * as axios from "axios";
import {
    AuthContainer,
    AuthFormBox,
    AuthFormCard,
    AuthRootErrorMessage,
    AuthSubTitle,
    AuthTitle,
} from "../../../components/auth/auth.style.tsx";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import { useAuthStore } from "../../../stores/auth/authStore.ts";

function SignInPage() {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInInputType>({
        resolver: zodResolver(signInSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: SignInInputType) => {
        try {
            // SignUp에서는 백엔드가 뭐라고 대답하든 "성공"이면 신경 안써도 됐는데
            // SignIn에서는 백엔드가 "성공" 대답하면서 신분증(token)을 응답함 => 그래서 response 변수를 만들어서 받아줘야 한다.
            const response = await axiosInstance.post("/user/login",data);
            // axios의 응답값인 response는 response.data에 실제 백엔드가 응답한 데이터가 담김
            // data = {
            //      message: "로그인에 성공했습니다",
            //      data: {
            //              user: {id: 1, username: "abc", name: "홍길동", ....},
            //              token: string
            //      }
            // }
            // user 정보와 token을 뽑아와야 함
            const { user, token } = response.data.data;

            login( user, token);

            // 신분증 발금은 login이라는 행위를 할 때에만 발급이 됨
            // 그렇기 떄문에 이 token을 어딘가(ContextAPI든, localStorage든)에 저장해서
            // 사용자가 백엔드에 요청을 할 떄마다 꺼내서 집어넣고 요청을 해야 함

            alert("로그인에 성공했습니다!");
            navigate("/");
        } catch (error) {
            let errorMessage = "로그인 중 오류가 발생했습니다.";

            if (axios.isAxiosError(error)) {
                // message라는 항목은 백엔드가 뱉어준 것이다.
                // catch에 모여지는 error는 axios에서 발생한 에러일 수도 있고, 아닐 수도 잇는데 (통신 자체 실패)
                // axios에서 발생한 에러이더라도
                // 백엔드가 정상적으로 뱉어준 2xx가 아닌 에러들은 백엔드가 { message: "어쩌구"} 형태로 응답함
                // 그렇기 때문에 {message: "어쩌구"}가 있을 때에는 그 내용을 errorMessage에 저장하고
                // 아니라면 기본 메시지인 "로그인 중 오류가 발생했습니다"를 유지하겠다
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", {message: errorMessage});
        }
    };

    return (
        <AuthContainer>
            <AuthFormCard onSubmit={handleSubmit(onSubmit)}>
                <AuthTitle>로그인</AuthTitle>
                <AuthSubTitle>다시 오신 것을 환영합니다!</AuthSubTitle>

                <AuthFormBox>
                    <InputGroup
                        label={"아이디"}
                        id={"username"}
                        errorMessage={errors.username?.message}
                        registerObj={register("username")}
                        placeholder={"아이디를 입력해주세요."}
                    />
                    <InputGroup
                        label={"비밀번호"}
                        id={"password"}
                        errorMessage={errors.password?.message}
                        registerObj={register("password")}
                        type={"password"}
                        placeholder={"비밀번호를 입력해주세요."}
                    />
                </AuthFormBox>
                {errors.root && <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>}
                <Button
                    type={"submit"}
                    fullWidth={true}
                    color={"primary"}
                    variant={"contained"}
                    disabled={isSubmitting}>
                    로그인
                </Button>
            </AuthFormCard>
        </AuthContainer>
    );
}

export default SignInPage;