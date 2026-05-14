import { type SignUpInputType, signUpSchema } from "../../../schemas/auth/signUpSchema.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import { Gender } from "../../../types/user.type.ts";
import Button from "../../../components/common/button/Button.tsx";
import { useNavigate } from "react-router";
import axiosInstance from "../../../api/axiosInstance.ts";
import * as axios from "axios";

function SignUpPage() {
    const navigate = useNavigate();

    // 회원가입 화면

    // input들을 react-hook-form으로 관리
    // 사용자가 입력한 값들을 백엔드로 보내기전 검증 절차 필요
    // 화면 작성

    // react-hook-form만 이용한다면, 사용자가 입력하는 값에 대한 검증 내용을
    // input {...register(input이름, {옵션})}
    // 형태로 옵션 자리에 기재해줌

    // 근데 react-hook-form + zod를 이용한다면 이미 검증 내용이 zod에 있음
    // 그렇다면, react-hook-form에다가 zod의 검증 내용을 알려주면 되지 않을까?

    // 이렇게 zod의 내용을 react-hook-form에 연결하기 위한 라이브러리 설치
    // pnpm install @hookform/resolvers

    // isSubmitting : handleSubmit을 통해 전송 중이라면 true 아니라면 false 값
    // setError : 에러 발생시 해당 항목에 대한 에러 메시지를 설정하는 메서드

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignUpInputType>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur", // 언제 검증할 것인지.
    });

    // errors
    // 처음에는 errors = {} 형태로 존재함
    // 그러다가 각 항목에 에러가 발생이 되면 (검증에 실패하면) 그 안에 key가 추가됨
    // username의 검증에 실패하면 errors = { username: { message: "에러내용"}}; 형태가 됨
    // errors는 각 항목에 대한 에러만 관리하는게 아니라 대표 errors 항목인 "root"라는 항목도 있음

    const onSubmit = async (data: SignUpInputType) => {
        // fetch()메소드는 JavaScript 표준 라이브러리에 포함되어 있는 기능
        // 사용을 하고 데이터를 받아올 때마다 JSON으로 바꿔줄 필요가 있음
        // 이게 붏편해서 만들어진 라이브러리가 axios
        // pnpm install axios
        try {
            // 전송에 대한 내용을 기재하면 되는데, 그대로 데이터를 전달할 것인가?
            // 프론트엔드에서'만' 필요한 passwordConfirm 항목이 추가되었음. 얘 빼고 전송.
            const { passwordConfirm, ...submitData } = data;

            // 200번대일때만 아래로 진행하고, 그 외의 응답은 바로 catch로 간다.
            // fetch()로 통신을 하면, 백엔드가 전달해주는 response가 존재하기만 하면 성공으로 판단하지만
            // axios로 통신을 하면, 백엔드가 2xx번대 성공 코드를 전달해줘야만 성공으로 판단
            // 이외의 에러는 catch로 처리됨
            // 보내줄때도 JSON.stringify() 할 필요 없음
            await axiosInstance.post("/user/create", submitData);

            // 성공을 했었을때 백엔드가 전달해준 내용은 response.data에 객체 상태로 존재함 (JSON 파싱할 필요 없음)

            // 백엔드에게 전송해서 성공(200번대 : 진짜 성공)
            alert("회원가입이 완료되었습니다. 로그인을 진행해주세요. ");
            navigate("/auth/signin");
        } catch (error) {
            // 기본 에러 메세지를 미리 넣어서 errorMessage 마련
            let errorMessage = "회원가입 중 오류가 발생했습니다.";

            // 지금 catch된 error가 axios의 에러인지 판별
            if (axios.isAxiosError(error)) {
                // axios에서 발생된 에러라면, 백엔드에서 제공을 한 내용이 error.response.data.message에 존재
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                // axios에서 발생한 에러가 아닌, 자바스크립트 표준 에러 객체라면
                // error.message에 담긴 에러 내용을 errorMessage에 저장
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <AuthContainer>
            <FormCard onSubmit={handleSubmit(onSubmit)}>
                <Title>회원가입</Title>
                <SubTitle>토론대난투에 오신 것을 환영합니다!</SubTitle>
                <FormBox>
                    <InputGroup>
                        <Label htmlFor={"username"}>아이디</Label>
                        <Input
                            {...register("username")}
                            id={"username"}
                            placeholder={"4자 이상 필요"}
                            $hasError={!!errors.username}
                        />
                        {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"password"}>비밀번호</Label>
                        <Input
                            type="password"
                            {...register("password")}
                            id={"password"}
                            placeholder={"6자 이상 필요"}
                            $hasError={!!errors.password}
                        />
                        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"passwordConfirm"}>비밀번호확인</Label>
                        <Input
                            type="password"
                            {...register("passwordConfirm")}
                            id={"passwordConfirm"}
                            placeholder={"비밀번호를 한번 더 입력 해주세요."}
                            $hasError={!!errors.passwordConfirm}
                        />
                        {errors.passwordConfirm && (
                            <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>
                        )}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"name"}>이름</Label>
                        <Input {...register("name")} id={"name"} $hasError={!!errors.name} />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"nickname"}>닉네임</Label>
                        <Input
                            {...register("nickname")}
                            id={"nickname"}
                            $hasError={!!errors.nickname}
                        />
                        {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"email"}>이메일</Label>
                        <Input
                            type="email"
                            {...register("email")}
                            id={"email"}
                            $hasError={!!errors.email}
                        />
                        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"phoneNumber"}>전화번호</Label>
                        <Input
                            type="tel"
                            {...register("phoneNumber")}
                            id={"phoneNumber"}
                            $hasError={!!errors.phoneNumber}
                        />
                        {errors.phoneNumber && (
                            <ErrorMessage>{errors.phoneNumber.message}</ErrorMessage>
                        )}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"birthdate"}>생년월일</Label>
                        <Input
                            type="date"
                            {...register("birthdate")}
                            id={"birthdate"}
                            $hasError={!!errors.birthdate}
                        />
                        {errors.birthdate && (
                            <ErrorMessage>{errors.birthdate.message}</ErrorMessage>
                        )}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"gender"}>성별</Label>
                        <Select {...register("gender")} id={"gender"} $hasError={!!errors.gender}>
                            <option value={""}>"성별을 선택해주세요"</option>
                            <option value={Gender.MALE}>"남성"</option>
                            <option value={Gender.FEMALE}>"여성"</option>
                        </Select>
                        {errors.gender && <ErrorMessage>{errors.gender.message}</ErrorMessage>}
                    </InputGroup>
                </FormBox>

                {errors.root && <RootErrorMessage>{errors.root.message}</RootErrorMessage>}

                <Button
                    type={"submit"}
                    fullWidth={true}
                    color={"primary"}
                    variant={"contained"}
                    disabled={isSubmitting}>
                    회원가입
                </Button>
            </FormCard>
        </AuthContainer>
    );
}

export default SignUpPage;

const AuthContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FormCard = styled.form`
    width: 100%;
    max-width: 480px;
    background-color: ${props => props.theme.colors.background.paper};
    border-radius: 16px;
    border: 1px solid ${props => props.theme.colors.divider};
    padding: 40px 20px;
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 800;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 8px;
    text-align: center;
`;

const SubTitle = styled.h6`
    font-size: 15px;
    color: ${props => props.theme.colors.text.disabled};
    text-align: center;
    margin-bottom: 32px;
`;

const FormBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 50px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 800;
    color: ${props => props.theme.colors.text.default};
`;

const Input = styled.input<{ $hasError: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    border: 1px solid ${props => (props.$hasError ? props.theme.colors.error : props.theme.colors.divider)};
    border-radius: 8px;
    font-size: 15px;
    color: ${props => props.theme.colors.text.default};
    transition: all 0.5s;

    &::placeholder {
       ${props => props.theme.colors.text.disabled};
    }

    &:focus {
        ${props => (props.$hasError ? props.theme.colors.error : props.theme.colors.primary)};
    }
`;

const Select = styled.select<{ $hasError?: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    border: 1px solid
        ${props => (props.$hasError ? props.theme.colors.error : props.theme.colors.divider)};
    border-radius: 8px;
    font-size: 15px;
    color: ${props => props.theme.colors.text.default};
    transition: all 0.5s;

    &::placeholder {
        color: ${props => props.theme.colors.text.disabled};
    }

    &:focus {
        border-color: ${props =>
            props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    }
`;

const ErrorMessage = styled.span`
    font-size: 13px;
    color: ${props => props.theme.colors.error};
    font-weight: 500;
`;

const RootErrorMessage = styled.p`
    font-size: 14px;
    text-align: center;
    color: ${props => props.theme.colors.error};
    font-weight: 500;
    margin-bottom: 50px;
`;
