import { useEffect, useState } from "react";
import type { Inquiry } from "../../../types/inquiry.type.ts";
import { Link, useSearchParams } from "react-router";
import adminInquiryApi from "../../../api/admin/adminInquiryApi.ts";
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
import Card from "../../../components/common/card/Card.tsx";
import Pagination from "../../../components/common/pagination/Pagination.tsx";
import Badge from "../../../components/common/badge/Badge.tsx";

function AdminInquiryListPage() {
    const [list, setList] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const SIZE = 20;
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / SIZE);



    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const loadList = async () => {
            try {
                const result = await adminInquiryApi.fetchInquiryList(page, SIZE);
                setList(result.list);
                setTotal(result.total);
            } catch (error) {
                console.log("문의글 목록 조회 실패 : ", error);
                alert("문의글 목록을 조회하는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        loadList().then(() => {});
    }, [page, SIZE]);

    const handlePageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams);
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>1:1 문의 관리</AdminTitle>
            </AdminPageHeader>

            <Card>
                {isLoading ? (
                    <AdminLoadingText>불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <AdminTh $width={"10%"}>ID</AdminTh>
                                <AdminTh>제목</AdminTh>
                                <AdminTh $width={"20%"}>작성일</AdminTh>
                                <AdminTh $width={"10%"}>작성자</AdminTh>
                                <AdminTh $width={"10%"}>상태</AdminTh>
                            </thead>
                            <tbody>
                                {list.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={5}
                                            style={{ textAlign: "center", padding: "100px 0" }}>
                                            등록된 문의글이 없습니다
                                        </AdminTd>
                                    </tr>
                                )}
                                {list.map(item => (
                                    <tr key={item.id}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd>
                                            <Link to={`/admin/inquiry/${item.id}`}>
                                                {item.title}
                                            </Link>
                                        </AdminTd>
                                        <AdminTd>
                                            {new Date(item.createdAt).toLocaleString("ko-kr", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </AdminTd>
                                        <AdminTd>
                                            {item.user.nickname}
                                        </AdminTd>
                                        <AdminTd>
                                            <Badge color={item.answer ? "success" : "default"}>
                                                {item.answer ? "답변" : "미답변"}
                                            </Badge>
                                        </AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                )}

                <Pagination
                    currentPage={page}
                    totalPage={totalPage}
                    onPageChange={handlePageChange}
                />
            </Card>
        </AdminContainer>
    );
}

export default AdminInquiryListPage;
