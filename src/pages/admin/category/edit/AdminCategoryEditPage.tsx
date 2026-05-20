import { useForm } from "react-hook-form";
import {
    type AdminEditCategoryInputType,
    adminEditCategorySchema,
} from "../../../../schemas/admin/category/adminEditCategorySchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminLoadingText,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import { Link, useNavigate, useParams } from "react-router";
import adminCategoryApi from "../../../../api/admin/adminCategoryApi.ts";
import axios from "axios";
import { useEffect, useState } from "react";

function AdminCategoryEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setValue, // input에 들어가는 값을 바꿀 수 있는 메서드.
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AdminEditCategoryInputType>({
        resolver: zodResolver(adminEditCategorySchema),
        mode: "onBlur",
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const result = await adminCategoryApi.fetchCategoryById(Number(id));
                // name: "name"인 input의 value를 result.name으로 변경해줘.
                // 내가 id로 조회한 그 카테고리의 name으로 input의 value가 변경된다.
                setValue("name", result.name);
            } catch (error) {
                console.log(error);
                alert("존재하지 않거나 삭제된 카테고리 입니다.");
                navigate("/admin/category");
            } finally {
                setLoading(false);
            }
        };
        loadInitialData().then(() => {});
    }, [id, navigate, setValue]);

    const onSubmit = async (data: AdminEditCategoryInputType) => {
        try {
            await adminCategoryApi.updateCategory(Number(id), data);
            alert("카테고리가 성공적으로 수정되었습니다.");
            navigate("/admin/category");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setError("name", { message: "이미 존재하는 카테고리 명입니다." });
                } else {
                    alert("카테고리 수정 중 오류가 발생했습니다.");
                }
            }
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>새 카테고리 수정</AdminTitle>
            </AdminPageHeader>
            <Card>
                {loading ? (
                    <AdminLoadingText>Loading...</AdminLoadingText>
                ) : (
                    <AdminForm onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup
                            id={"name"}
                            label={"카테고리 이름"}
                            placeholder={"수정할 카테고리명을 입력하세요(최대 50자)"}
                            errorMessage={errors.name?.message}
                            registerObj={register("name")}
                        />
                        <AdminButtonGroup $align={"left"}>
                            <Button
                                color={"secondary"}
                                variant={"text"}
                                as={Link}
                                to={"/admin/category"}>
                                취소
                            </Button>
                            <Button
                                type={"submit"}
                                color={"primary"}
                                variant={"contained"}
                                disabled={isSubmitting}>
                                수정
                            </Button>
                        </AdminButtonGroup>
                    </AdminForm>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminCategoryEditPage;
