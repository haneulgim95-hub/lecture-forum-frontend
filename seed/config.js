import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// commonJS에서는 기본으로 현재 경로를 __dirname 이라는 변수에 저장해놓지만
// ES module 에서는 제공하지 않아서 직접 만들어줘야 함
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv를 통해 환경변수 파일을 불러오는데, 매개변수에 옵션 객체를 넣어 설정을 해줄 수 있음
// path라는 프로퍼티로, "여기에서 .env를 불러와" 라고 지칭 가능
// 위치는 path 라이브러리를 통해 __dirname (현재 경로 위치값이 저장되어 있는 기본 변수) 와 "../.env"를
// 합쳐서 (join) 넣어줌
dotenv.config({ path: path.join(__dirname, "../.env") }); // 환경 설정 파일을 불러옴.

export const BASE_URL = process.env.VITE_API_BASE_URL;
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
