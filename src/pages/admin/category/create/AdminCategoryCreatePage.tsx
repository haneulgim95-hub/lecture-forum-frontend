import { useForm } from "react-hook-form";
import {
    type AdminCreateCategoryInputType,
    adminCreateCategorySchema,
} from "../../../../schemas/admin/adminCreateCategorySchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import { Link, useNavigate } from "react-router";
import adminCategoryApi from "../../../../api/admin/adminCategoryApi.ts";
import * as axios from "axios";

function AdminCategoryCreatePage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setErrors,
        formState: { errors, isSubmitting },
    } = useForm<AdminCreateCategoryInputType>({
        resolver: zodResolver(adminCreateCategorySchema),
    });

    const onSubmit = async (data: AdminCreateCategoryInputType) => {
        try {
            await adminCategoryApi.createCategory(data);
            alert("카테고리 생성작업에 성공했습니다.");
            navigate("/admin/category");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setErrors("name", {message: "이미 존재하는 카테고리 명입니다."});
            } else {
                alert("카테고리 생성 중 오류가 발생했습니다.");
            }
        }
    }

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>새 카테고리 추가</AdminTitle>
            </AdminPageHeader>
            <Card>
                <AdminForm onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup
                        id={"name"}
                        label={"카테고리명"}
                        placeholder={"카테고리명을 입력해주세요."}
                        registerObj={register("name")}
                        errorMessage={errors.name?.message}
                    />
                    <AdminButtonGroup>
                        <Button color={"primary"} variant={"text"} as={Link} to={"/admin/category"}>
                            취소
                        </Button>
                        <Button color={"primary"} variant={"contained"} type={"submit"} disabled={isSubmitting}>
                            추가
                        </Button>
                    </AdminButtonGroup>
                </AdminForm>
            </Card>
        </AdminContainer>
    );
}
export default AdminCategoryCreatePage;
