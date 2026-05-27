import { useEffect, useState } from "react";
import { Role, type User } from "../../../types/user.type.ts";
import adminUserApi from "../../../api/admin/user/adminUserApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminLoadingText,
    AdminPageHeader,
    AdminTable,
    AdminTableWrapper,
    AdminTd,
    AdminTh,
    AdminTitle,
} from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import { Link, useSearchParams} from "react-router";
import Card from "../../../components/common/card/Card.tsx";
import Badge from "../../../components/common/badge/Badge.tsx";
import { FiEdit, FiTrash } from "react-icons/fi";

function AdminUserListPage() {
    const [list, setList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [ searchParams, setSearchParams ] = useSearchParams();
    // const pageParams = searchParams.get("page");
    // const page = pageParams ? Number(pageParams) : 1;
    const page = Number(searchParams.get("page")) || 1; // 이것 자체가 state 임

    const SIZE = 20; // 한 페이지에 몇개를 보여줄수 있는지
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / SIZE); // Math.ceil() : 올림 메서드

    const loadUsers = async (page: number) => {
        try {
            const data = await adminUserApi.fetchUserList(page, SIZE);
            setList(data.list);
            setTotal(data.total);
        } catch (error) {
            console.log(error);
            alert("유저 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 이 함수는, 백엔드에게 내용을 받아서 state에 저장 => 화면 출력을 해주는 함수를 useEffect
        // 함수 스코프에 의해 외부에서는 실행이 불가능함

        // 함수 안에 함수를 선언하고, 그걸 실행했었음
        // 함수 스코프에 의해 외부에서는 실행이 불가능함 => 외부에서도 저 기능을 이용해야 되는 상황이 되었으미
        // 그 함수를 밖으로 뺌

        // 사용자의 스크롤을 이동시키는 명령
        window.scrollTo({ top: 0, behavior: "instant" });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers(page).then(() => {});

        // useEffect는 초기렌더링이 끝난 즉시 1번 무조건 실행됨
        // page가 바뀔 때 => useEffect의 의존성이 하는 일
        // useEffect는 useEffect(함수, 의존성배열);
        // 의존성 배열에 넣은 변수나 함수나 메서드나 state가 바뀔 때 재실행됨
    }, [page]);

    const handleDelete = async (id: number) => {
        // confirm은 사용자에게 경고창을 통해 확인을 받는 메서드. true/false가 반환됨
        // 그렇게 취소를 하면 더 이상 함수 진행을 안함
        if (!confirm("정말 이 유저를 삭제(탈퇴) 처리 하시겠습니까?")) {
            // 확인을 누르면 true가 나가고, 취소를 누르면 false가 나간다.
            return;
        }

        try {
            await adminUserApi.deleteUser(id);
            alert("사용자 정보가 성공적으로 삭제되었습니다.");

            // 그렇게 삭제처리가 끝난 정보가 result에 도착했고
            // 사용자 화면에 반영해줘야 함
            // 1. 다시금 백엔드에게 요청해서 데이터를 받아 화면 갱신
            // 2. 삭제된 사용자 정보를 화면에 바로 반영 (백엔드 x)
            // 카테고리 목록 화면에서는 2번으로 진행했었음

            // 1번으로 진행하려면, =>   이미 우리가 작성한 내용이 있음
            // 1-1. 백엔드에게 다시 데이터 요청 후
            // 1-2. 받아온 정보를 목록을 관리하는 state에 덮어쓰기
            loadUsers(page).then(() => {});
        } catch (error) {
            console.log(error);
            alert("사용자 삭제 중 오류가 발생했습니다.");
        }
    };

    const handlePageChange = (page: number) => {
        // state의 값을 바로 바꾸는게 아니라,
        // 쿼리스트링에 존재하는 page의 값을 변경해야 함
        searchParams.set("page", page.toString());      // searchParams 내부의 page 프로퍼티 값을 변경
        setSearchParams(searchParams);                          // 주소 변경
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>사용자 관리</AdminTitle>
                <Button color={"primary"} variant={"contained"} as={Link} to={"/admin/user/create"}>
                    + 사용자 추가
                </Button>
            </AdminPageHeader>

            <Card>
                {loading ? (
                    <AdminLoadingText>불러오는중...</AdminLoadingText>
                ) : (
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh $width={"5%"}>ID</AdminTh>
                                    <AdminTh $width={"15%"}>아이디</AdminTh>
                                    <AdminTh $width={"15%"}>이름 (닉네임)</AdminTh>
                                    <AdminTh $width={"20%"}>이메일</AdminTh>
                                    <AdminTh $width={"10%"}>권한</AdminTh>
                                    <AdminTh $width={"10%"}>상태</AdminTh>
                                    <AdminTh $width={"15%"}>가입일</AdminTh>
                                    <AdminTh $width={"10%"}>관리</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={8}
                                            style={{ textAlign: "center", padding: "100px" }}>
                                            등록된 유저가 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {list.map(item => (
                                    <tr key={item.id}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd>{item.username}</AdminTd>
                                        <AdminTd>
                                            {item.name}
                                            <br />
                                            <small>{item.nickname}</small>
                                        </AdminTd>
                                        <AdminTd>{item.email}</AdminTd>
                                        <AdminTd>
                                            <Badge
                                                color={
                                                    item.role === Role.ADMIN ? "error" : "primary"
                                                }>
                                                {item.role === Role.ADMIN ? "관리자" : "일반"}
                                            </Badge>
                                        </AdminTd>
                                        <AdminTd>
                                            <Badge color={item.deletedAt ? "default" : "success"}>
                                                {item.deletedAt ? "탈퇴" : "정상"}
                                            </Badge>
                                        </AdminTd>
                                        <AdminTd>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </AdminTd>
                                        <AdminTd>
                                            <AdminButtonGroup>
                                                <Button
                                                    color={"primary"}
                                                    variant={"icon"}
                                                    as={Link}
                                                    to={`/admin/user/${item.id}`}>
                                                    <FiEdit size={18} />
                                                </Button>
                                                {!item.deletedAt && (
                                                    <Button
                                                        color={"error"}
                                                        variant={"icon"}
                                                        onClick={() => handleDelete(item.id)}>
                                                        <FiTrash size={18} />
                                                    </Button>
                                                )}
                                            </AdminButtonGroup>
                                        </AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                )}

                {total > 0 && (
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "20px"}}>
                        <Button
                            variant={"text"}
                            color={"primary"}
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}>
                            이전
                        </Button>
                        <Button
                            variant="text"
                            color="primary"
                            disabled={page === totalPage}
                            onClick={() => handlePageChange(page + 1)}>
                            다음
                        </Button>
                    </div>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminUserListPage;

// 컴포넌트 생명주기
// state라고 하는 저장소는 해당 컴포넌트가 화면에 살아있을 때만 유지됨
// 컴포넌트가 해제(언마운트) => 그 안에 존재하던 데이터들 (state,변수,function)이 다 메모리에서 해제됨
// 뒤로가기를 해서 다시 adminUserListPage를 불러와봤자 그데이터들은 다시 돌아오지 않음
// adminUserLIstPage이 마운트 되면 page 라는 state가 새로 생기고 그 초기값이 1로 세팅되었음

// 옛날 방식과 리액트가 다른점
// 옛날방식: 진짜 브라우저가 갖고 있던 데이터를 그대로 보여줌
// 리액트 : Single Page Application, 브라우저가 생각하는 물리 페이지는 1개임 (index.html)
//          즉 실제주소는 / 뿐이고, 그 안에서 리액트 라우터가 "가상 주소"로 동작시키는 중임
//          뒤로가기를 누르면 /admin/user로 이동하지만 이건 가상주소 이므로
//          리액트가 재실행되면서 /admin/user라는 주소에 라우팅된 컴포넌트를 화면에 다시 그림

// 쿼리스트링을 이용해야 되고, 쿼리스트링이 있으면 그걸 state의 초기값으로 써야겠다 , 쿼리스트링이 없으면 그냥 1을 초기값으로 쓴다