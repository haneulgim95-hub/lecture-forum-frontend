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
import { Link } from "react-router";
import Card from "../../../components/common/card/Card.tsx";
import Badge from "../../../components/common/badge/Badge.tsx";
import { FiEdit, FiTrash } from "react-icons/fi";

function AdminUserListPage() {
    const [list, setList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const SIZE = 20;
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / SIZE);

    const loadUsers = async (page: number) => {
        try {
            const result = await adminUserApi.fetchUserList(page, SIZE);
            setList(result.list);
            setTotal(result.total);
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
        window.scrollTo({top: 0, behavior: "smooth"});

        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers(page).then(() => {});
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
            loadUsers().then(() => {});
        } catch (error) {
            console.log(error);
            alert("사용자 삭제 중 오류가 발생했습니다.");
        }
    };

    const handlePageChange = (page: number) => {
        setPage(page);
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
                {total > 0 && <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Button color={"primary"} variant={"text"} disabled={page === 1} onClick={() => handlePageChange(page - 1)}>이전</Button>
                    <Button color={"primary"} variant={"text"} disabled={page === totalPage} onClick={() => handlePageChange(page + 1)}>다음</Button>
                </div>}
            </Card>
        </AdminContainer>
    );
}

export default AdminUserListPage;
