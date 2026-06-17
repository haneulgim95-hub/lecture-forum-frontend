import { useEffect, useState } from "react";
import adminDashboardApi from "../../api/admin/adminDashboardApi.ts";
import {
    AdminContainer,
    AdminDashboardWrapper,
    AdminPageHeader,
    AdminTable,
    AdminTableWrapper,
    AdminTd,
    AdminTh,
    AdminTitle,
} from "../../components/admin/admin.style.tsx";
import { LoadingText } from "../../components/post/post.style.tsx";
import Card from "../../components/common/card/Card.tsx";
import Badge from "../../components/common/badge/Badge.tsx";
import { useNavigate } from "react-router";
import type { User } from "../../types/user.type.ts";
import type { Post } from "../../types/post.type.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<{
        users: User[];
        posts: Post[];
        inquiries: Inquiry[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const result = await adminDashboardApi.fetchDashboardSummary();
                setSummary(result);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSummary().then(() => {});
    }, []);

    if (isLoading)
        return (
            <AdminContainer>
                <LoadingText>대시보드를 불러오는 중...</LoadingText>
            </AdminContainer>
        );

    if (!summary) return;

    return (
        <AdminContainer style={{ gap: "50px" }}>
            <AdminDashboardWrapper>
                <AdminPageHeader>
                    <AdminTitle>최근 가입한 사용자 목록</AdminTitle>
                </AdminPageHeader>
                <Card>
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh $width={"10%"}>ID</AdminTh>
                                    <AdminTh $width={"15%"}>아이디</AdminTh>
                                    <AdminTh $width={"15%"}>이름 (닉네임)</AdminTh>
                                    <AdminTh>이메일</AdminTh>
                                    <AdminTh $width={"10%"}>상태</AdminTh>
                                    <AdminTh $width={"20%"}>가입일</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.users.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={6}
                                            style={{ textAlign: "center", padding: "100px" }}>
                                            가입한 유저가 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {summary.users.map(item => (
                                    <tr
                                        key={item.id}
                                        onClick={() => navigate(`/admin/user/${item.id}`)}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd>{item.username}</AdminTd>
                                        <AdminTd>{item.nickname}</AdminTd>
                                        <AdminTd>{item.email}</AdminTd>
                                        <AdminTd>
                                            <Badge color={item.deletedAt ? "default" : "success"}>
                                                {item.deletedAt ? "탈퇴" : "정상"}
                                            </Badge>
                                        </AdminTd>
                                        <AdminTd>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                </Card>
            </AdminDashboardWrapper>
            <AdminDashboardWrapper>
                <AdminPageHeader>
                    <AdminTitle>최근 등록된 게시글 목록</AdminTitle>
                </AdminPageHeader>
                <Card>
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh $width={"10%"}>번호</AdminTh>
                                    <AdminTh>제목</AdminTh>
                                    <AdminTh $width={"15%"}>작성자</AdminTh>
                                    <AdminTh $width={"15%"}>작성일</AdminTh>
                                    <AdminTh $width={"10%"}>조회수</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.posts.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={5}
                                            style={{ textAlign: "center", padding: "100px" }}>
                                            아직 작성된 게시글이 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {summary.posts.map(item => (
                                    <tr key={item.id} onClick={() => navigate(`/post/${item.id}`)}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd className={"title-cell"}>{item.title}</AdminTd>
                                        <AdminTd>{item.user.nickname}</AdminTd>
                                        <AdminTd>
                                            {new Date(item.createdAt).toLocaleString("ko-kr", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </AdminTd>
                                        <AdminTd>{item.views}</AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                </Card>
            </AdminDashboardWrapper>
            <AdminDashboardWrapper>
                <AdminPageHeader>
                    <AdminTitle>최근 등록된 문의글 목록</AdminTitle>
                </AdminPageHeader>
                <Card>
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh $width={"10%"}>번호</AdminTh>
                                    <AdminTh>제목</AdminTh>
                                    <AdminTh $width={"15%"}>작성자</AdminTh>
                                    <AdminTh $width={"15%"}>작성일</AdminTh>
                                    <AdminTh $width={"15%"}>상태</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.inquiries.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={5}
                                            style={{ textAlign: "center", padding: "100px" }}>
                                            아직 작성된 문의글이 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {summary.inquiries.map(item => (
                                    <tr
                                        key={item.id}
                                        onClick={() => navigate(`/admin/inquiry/${item.id}`)}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd className={"title-cell"}>{item.title}</AdminTd>
                                        <AdminTd>{item.user.nickname}</AdminTd>
                                        <AdminTd>
                                            {new Date(item.createdAt).toLocaleString("ko-kr", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </AdminTd>
                                        <AdminTd>
                                            <Badge color={item.answer ? "success" : "default"}>
                                                {item.answer ? "답변완료" : "답변대기"}
                                            </Badge>
                                        </AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                </Card>
            </AdminDashboardWrapper>
        </AdminContainer>
    );
}

export default AdminDashboardPage;
