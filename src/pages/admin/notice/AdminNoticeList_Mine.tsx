import { useCallback, useEffect, useState } from "react";
import type { Notice } from "../../../types/notice.type.ts";
import noticeApi from "../../../api/user/noticeApi.ts";
import { Link, useSearchParams } from "react-router";
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
import Card from "../../../components/common/card/Card.tsx";
import { FiEdit, FiTrash } from "react-icons/fi";
import Pagination from "../../../components/common/pagination/Pagination.tsx";
import adminNoticeApi from "../../../api/admin/adminNoticeApi.ts";

function AdminNoticeList_Mine() {
    const [list, setList] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const size = 15;
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / size);

    const loadList = useCallback(async () => {
        try {
            const data = await noticeApi.getNoticeList(page, size);
            setList(data.list);
            setTotal(data.total);
        } catch (error) {
            console.log(error);
            alert("공지사항 목록을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [page, size])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadList().then(() => {});
    }, [page, loadList])

    const handlePageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams);
    };

    const handleDelete = async (noticeId: number) => {
            if (!confirm("정말 이 공지사항을 삭제 처리 하시겠습니까?")) return;
        try {

            await adminNoticeApi.deleteNotice(noticeId);
            alert("공지사항이 성공적으로 삭제되었습니다.");
            await loadList();
        } catch (error) {
            console.log("공지사항 삭제 실패: ",error);
            alert("공지사항 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>공지사항 관리</AdminTitle>
                <Button color={"primary"} variant={"contained"} as={Link} to={"/admin/notice/create"}>
                    + 공지사항 추가
                </Button>
            </AdminPageHeader>

            <Card>
                {isLoading ? (
                    <AdminLoadingText>불러오는중...</AdminLoadingText>
                ) : (
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh $width={"5%"}>ID</AdminTh>
                                    <AdminTh $width={"15%"}>생성일</AdminTh>
                                    <AdminTh >공지사항 제목</AdminTh>
                                    <AdminTh $width={"15%"}>관리</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={3}
                                            style={{ textAlign: "center", padding: "100px" }}>
                                            등록된 공지사항이 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {list.map(item => (
                                    <tr key={item.id}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd>{new Date(item.createdAt).toLocaleString("ko-kr", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}</AdminTd>
                                        <AdminTd>{item.title}</AdminTd>
                                        <AdminTd>
                                            <AdminButtonGroup $align={"left"}>
                                                <Button
                                                    color={"primary"}
                                                    variant={"icon"}
                                                    as={Link}
                                                    to={`/admin/notice/${item.id}`}>
                                                    <FiEdit size={18} />
                                                </Button>
                                                    <Button
                                                        color={"error"}
                                                        variant={"icon"}
                                                        onClick={() => handleDelete(item.id)}>
                                                        <FiTrash size={18} />
                                                    </Button>
                                            </AdminButtonGroup>
                                        </AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                )}

                {total > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPage={totalPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminNoticeList_Mine;