import * as axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// axios를 사용하는 가장 큰 이유
// 사용자에 대한 신분증을 매 번 요청할 때 제시해야 하는데
// 그걸 axios의 인터셉터라고 하는 기능을 통해 한 번에 구현할 수 있음
// 인터셉터라는 기능은, express를 사용할 때 validate를 구현해서 중간에 처리하는 middleware와 유사한 기능을 제공함

const api = axios.create({
    baseURL: BASE_URL, // 통신을 진행할 상대의 기본 주소
    timeout: 5000,      // 통신 요청을 했을 때 실패되었다고 판단하는 타임아웃 시간 (ms 밀리세컨드 단위. 5초)
    withCredentials: true,  // CORS 요청을 허용할지 여부
});

export default api;