// 게시글 등록에 필요한것: title, content
import { ADMIN_TOKEN, BASE_URL } from "./config.js";

const mockNoticeList = [
    {
        title: "토론장 이용 규칙 안내",
        content:
            "건전한 토론 문화를 위해 욕설, 비방, 혐오 표현 및 도배 행위는 금지됩니다. 위반 시 게시글 삭제 및 이용 제한이 적용될 수 있습니다.",
    },
    {
        title: "신규 카테고리 'IT · 개발' 오픈",
        content:
            "개발, 프로그래밍, AI, 최신 기술 트렌드에 대해 자유롭게 토론할 수 있는 IT · 개발 카테고리가 새롭게 추가되었습니다.",
    },
    {
        title: "인기 토론글 선정 기준 변경",
        content:
            "더 다양한 의견이 노출될 수 있도록 인기 토론글 선정 기준에 조회수, 추천 수, 댓글 참여율이 함께 반영됩니다.",
    },
    {
        title: "서버 점검 안내",
        content:
            "안정적인 서비스 제공을 위해 6월 15일 오전 2시부터 4시까지 서버 점검이 진행됩니다. 점검 시간 동안 서비스 이용이 제한될 수 있습니다.",
    },
    {
        title: "댓글 신고 기능 추가",
        content:
            "부적절한 댓글을 빠르게 관리할 수 있도록 댓글 신고 기능이 추가되었습니다. 신고된 내용은 운영진이 검토 후 조치합니다.",
    },
    {
        title: "주간 베스트 토론 이벤트",
        content:
            "매주 가장 많은 추천을 받은 토론글 작성자에게 특별 배지를 지급합니다. 다양한 주제로 적극적인 참여 부탁드립니다.",
    },
    {
        title: "회원 프로필 기능 업데이트",
        content:
            "이제 프로필에서 작성한 게시글, 댓글, 받은 추천 수를 확인할 수 있습니다. 나만의 토론 활동을 한눈에 살펴보세요.",
    },
    {
        title: "익명 토론 게시판 운영 시작",
        content:
            "보다 자유로운 의견 교환을 위해 익명 토론 게시판이 오픈되었습니다. 단, 운영 정책은 기존 게시판과 동일하게 적용됩니다.",
    },
];

const CREATE_NOTICE_URL = BASE_URL + "/admin/notice/create";

async function generatePosts() {
    try {
        const randomCount = Math.floor(Math.random() * 10) + 3;

        for (let i = 0; i < randomCount; i++) {
            const noticeData = mockNoticeList[Math.floor(Math.random() * mockNoticeList.length)];
            if (!noticeData) {
                throw new Error("noticeList가 존재하지 않습니다.");
            }

            try {
                const response = await fetch(CREATE_NOTICE_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${ADMIN_TOKEN}`,
                    },
                    body: JSON.stringify(noticeData),
                });

                const result = await response.json();
                console.log(result);

                if (!response.ok) {
                    throw new Error(result.message);
                } else {
                    console.log(`[${i + 1}/${randomCount}}] 공지사항 등록 성공`);
                }
            } catch (error) {
                console.log("실패 메세지: ", error.message);
            }
        }
    } catch (error) {
        console.log("실패", error);
    }
}

generatePosts().then(() => {});
