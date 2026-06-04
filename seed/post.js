// 글을 등록하기 위해서 필요한것...
// 필수 : title, content, categoryId
// 선택 : option1Text, option2Text

// post.js에서 만들어줄 함수
// 카테고리 목록을 return 하는 함수
// 카테고리Id를 매개변수로 받아서 글을 등록하는 함수
// 실행하는 함수

import { ADMIN_TOKEN, BASE_URL } from "./config.js";

const CATEGORY_LIST_URL = BASE_URL + "/category";

const mockPostList = [
    {
        title: "탕수육 먹을 때 소스는?",
        option1Text: "무조건 부먹",
        option2Text: "바삭하게 찍먹",
    },
    {
        title: "아이스 아메리카노 vs 따뜻한 아메리카노",
        option1Text: "얼죽아",
        option2Text: "쩌죽따",
    },
    {
        title: "치킨 먹을 때",
        option1Text: "닭다리부터",
        option2Text: "닭가슴살부터",
    },
    {
        title: "민트초코에 대한 당신의 견해는?",
        option1Text: "신의 음식 (극호)",
        option2Text: "치약 맛(극혐)",
    },
    {
        title: "평생 한 가지만 먹어야 된다면?",
        option1Text: "평생 짜장면만 먹기",
        option2Text: "평생 짬뽕만 먹기",
    },
    {
        title: "꺳잎 논쟁, 내 연인이 친구의 깻잎을 떼어준다면?",
        option1Text: "매너일 뿐 괜찮다",
        option2Text: "절대 안됨 난리남",
    },
    {
        title: "새우 논쟁, 내 연인이 새우를 까준다면?",
        option1Text: "새우 정도야",
        option2Text: "결별 사유임",
    },
    {
        title: "출근 시간 정시 도착의 기준은?",
        option1Text: "9시 정각 문 통과",
        option2Text: "8시 50분 착석 완료",
    },
];

async function fetchCategories() {
    try {
        const response = await fetch(CATEGORY_LIST_URL);
        if (!response.ok) throw new Error("카테고리 목록을 불러오는데 실패했습니다.");
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.log("카테고리 조회 중 에러 발생", error.message);
        return [];
    }
}

const POST_CREATE_URL = BASE_URL + "/post/create";

async function generatePosts(categoryId, count) {
    for (let i = 0; i < count; i++) {
        try {
            const topic = mockPostList[Math.floor(Math.random() * mockPostList.length)];

            const dummyData = {
                title: topic.title,
                option1Text: topic.option1Text,
                option2Text: topic.option2Text,
                categoryId: categoryId,
                content:
                    "이 게시글은 토론대난투 시스템을 검증하기 위해 생성된 자동화 테스트 글입니다. \n\n" +
                    "과연 여러분의 선택은 어느 쪽인가요?\n" +
                    `1번 ${topic.option1Text}과 2번 ${topic.option2Text} 중 마음에 드는 진영에 투표하고, ` +
                    "아래 댓글 창에서 논리 제안을 시작해주세요!",
            };

            const response = await fetch(POST_CREATE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
                body: JSON.stringify( dummyData ),
            });
            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`${response.status} ${errorDetail}`);
            }
            console.log(`[${i + 1}/${count}] : 카테고리ID(${categoryId}) 생성 성공`);
        } catch (error) {
            console.log(`[${i + 1}/${count}] : 카테고리ID(${categoryId}) 생성 실패`);
            console.log("실제 발생한 에러 원인:", error);
        }
    }
}

async function runSeeder() {
    try {
        const categoryList = await fetchCategories();
        if (!categoryList || categoryList.length === 0) {
            console.log("카테고리 데이터를 불러오지 못했습니다. 시드 작업을 중단합니다.");
            return;
        }

        const postsPerCategory = 2;

        for (const category of categoryList) {
            console.log(`카테고리ID(${category.id})에 대한 게시글 생성 작업을 시작합니다.`);
            await generatePosts(category.id, postsPerCategory);
        }

        console.log("모든 카테고리에 대한 게시글 시딩 작업이 완전히 종료되었습니다.");
    } catch (error) {
        console.log("게시글 생성 작업 실패: ", error);
    }
}

runSeeder().then(() => {});
