import * as axios from "axios";
import { useAuthStore } from "../stores/auth/authStore.ts";
import { isAxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// axios를 사용하는 가장 큰 이유
// 사용자에 대한 신분증을 매 번 요청할 때 제시해야 하는데
// 그걸 axios의 인터셉터라고 하는 기능을 통해 한 번에 구현할 수 있음
// 인터셉터라는 기능은, express를 사용할 때 validate를 구현해서 중간에 처리하는 middleware와 유사한 기능을 제공함

const api = axios.create({
    baseURL: BASE_URL, // 통신을 진행할 상대의 기본 주소 (필수)
    timeout: 5000, // 통신 요청을 했을 때 실패되었다고 판단하는 타임아웃 시간 (ms 밀리세컨드 단위. 5초)
    withCredentials: true, // CORS 요청을 허용할지 여부
});

export default api;

// 인터셉터 : 요청을 보내기 전에 axios가 (매번) 내용을 가로채서 내용을 변경할 수 잇음.

// 리퀘스트에 해당하는 인터셉터는 api.interceptors.request에 등록할 수 있고,
// api.interceptors.request.use() 메서드에 해당 내용을 매개변수에 함수로서 작성 -> 요청을 보내기 직전
// 그렇게 집어넣은 함수의 매개변수 첫 자리에는 Request를 보낼 때의 설정 정보가 들어옴
api.interceptors.request.use(config => {
    // 우리가 프론트엔드에서 갖고 있는 토큰 정보를 가지고서
    // Request의 HTTP 메세지 헤더에 넣어줘야 함
    const { token } = useAuthStore.getState(); // 컴포넌트가 아니여서 getState() 사용.

    // 이 interceptor는 이 axiosInstance를 사용하는 모든 요청에 발동되는 기능이고,
    // 사용자는 로그인이 되어져 있을 수도 있고, 없을 수도 있으므로
    // token이 있을 수도 있고 없을 수도 있음
    // 그러니, token이 있 을 때만 헤더에 추가해 줘야 하는구나

    if (token) {
        // token이 있 을 때에만 요청 헤더에 토큰 정보를 기재해서 보냄
        // config.headers <- axios를 사용할 때 HTTP 메세지 헤더는 이렇게 접근 가능

        // 토큰 정보는 꼭 Authorization 이라는 key에 값으로 입력해줘야 하며,
        // 심지어 값에 token만 넣는게 아니라 꼭 Bearer라는 글자를 앞에 붙여서 넣어줘야 함
        config.headers.Authorization = `Bearer ${token}`;

        // 토큰 앞에 붙이는 prefix(접두사)를 붙이는 이유
        // Bearer라고 붙으면, 그 뒤에는 JWT token 처럼 string으로 암호화한 값이 들어간다는 의미
        // Basic라고 붙으면, 그 뒤에는 Base64로 인코딩된 값이 들어간다는 의미 (그렇구나..)
        // Digest라고 붙으면, MD5 형식으로 암호화한 값이 들어간다는 의미
    }
    return config;
});

// api.interceptors.response에는 그렇게 요청한 응답이 도착했을때 -> 응답을 받은 직후
// 응답을 실제 사용하기 전, 해야할 일에 대해서 api.interceptors.response.use() 에다가
// 등록할 수 있음

// interceptors.response.use(성공일(HTTP STATUS 200) 때 해야되는 일(함수), 실패(HTTP STATUS 4xx 또는 5xx)일 때 해야되는 일(함수))
api.interceptors.response.use(
    response => response,
    error => {
        if (isAxiosError(error) && error.response) {
            if (error.response.status === 401) {
                useAuthStore.getState().logout();
                // 사용자를 이동시켜줘야 하는데, 마찬가지로 컴포넌트 안이 아니니깐 useNavigate를 쓸 수 없음
                // useState (x), useEffect(x), useNavigate(x). react-hook 전부 다 못 씀
                alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요. ");
                window.location.href = "/auth/login";
            }
        }

        // 인터셉터를 통해 "실패"에 해당하는 HTTP status code가 와서 axios는 실패(두번째 매개변수)로 잡았지만
        // return에 따라 상위 try -catch에서 잡는걸 바꿔줄 수도 있음
        // 성공으로 바꿔주려면 Promise.resolve()
        // 실패로 진행하려면 Promise.reject()

        // 인터셉터가 중간에 가로채서 대리 처리해줄수 없는 에러들이 들어왔을 대.
        // 이 에러는 내가 처리할 수 없으니 원래 이 요청을 보냈떤 API함수와 컴포넌트의 try - catch문으로 그대로 넘길게! 
        return Promise.reject(error);   // 원래 이게 실행되고 있었던 try - catch 절에 catch로 다시 던짐

            // 401 에러가 아닐 때는: 상위 컴포넌트가 에러를 받아서 화면에 에러 메시지를 띄우는 등 진짜 에러 처리를 하게 되고,
            //
            // 401 에러일 때는: 상위 컴포넌트로 에러가 던져지긴 하지만, 직전에 내린 window.location.href 명령 때문에 브라우저가 화면을 엎어버리고 강제 이동시키므로 상위 컴포넌트의 catch문은 사실상 무용지물이 됩니다.
    },
);
