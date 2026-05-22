import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import {
    type AdminUpdateUserInputType,
    adminUpdateUserSchema,
} from "../../../../schemas/admin/user/adminUpdateUserSchema.ts";
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
import SelectGroup from "../../../../components/common/select/SelectGroup.tsx";
import { Gender, Role } from "../../../../types/user.type.ts";
import { AuthRootErrorMessage } from "../../../../components/auth/auth.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import adminUserApi from "../../../../api/admin/user/adminUserApi.ts";
import axios from "axios";
import { useEffect, useState } from "react";

function AdminUserUpdatePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AdminUpdateUserInputType>({
        resolver: zodResolver(adminUpdateUserSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await adminUserApi.getUserById(Number(id));
                reset({
                    username: user.username,
                    name: user.username,
                    nickname: user.nickname,
                    email: user.email,
                    phoneNumber: user.phoneNumber ?? undefined,
                    birthdate: user.birthdate ? user.birthdate.split("T")[0] : undefined,
                    gender: user.gender,
                    role: user.role,
                })
            } catch (error) {
                console.log(error);
                alert("사용자 정보를 볼러오는 도중 오류가 발생했습니다");
                navigate("/admin/user");
            } finally {
                setLoading(false);
            }
        };
        loadUser().then(() => {});
    }, []);

    const onSubmit = async (data: AdminUpdateUserInputType) => {
        try {
            await adminUserApi.updateUser(Number(id), data);
            alert("사용자 정보가 수정되었습니다.");
            navigate("/admin/user");
        } catch (error) {
            const errorMessage = "사용자 정보를 수정하는데 실패하였습니다.";
            if (axios.isAxiosError(error)) {
                setError("root", { message: error.response?.data?.message || errorMessage });
            } else if (error instanceof Error) {
                setError("root", { message: error.message || errorMessage });
            }
            setError("root", { message: errorMessage });
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>사용자 정보 수정</AdminTitle>
            </AdminPageHeader>
            <Card>
                {loading ? (
                    <AdminLoadingText>데이터를 불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminForm onSubmit={handleSubmit(onSubmit)} $wrap={true}>
                        <InputGroup
                            wrap={true}
                            label={"아이디"}
                            id={"username"}
                            errorMessage={errors.username?.message}
                            registerObj={register("username")}
                            placeholder={"4자 이상 필요"}
                        />
                        <InputGroup
                            wrap={true}
                            label={"비밀번호"}
                            id={"password"}
                            errorMessage={errors.password?.message}
                            registerObj={register("password")}
                            type={"password"}
                            placeholder={"6자 이상 필요"}
                        />
                        <InputGroup
                            wrap={true}
                            label={"이름"}
                            id={"name"}
                            errorMessage={errors.name?.message}
                            registerObj={register("name")}
                        />
                        <InputGroup
                            wrap={true}
                            label={"닉네임"}
                            id={"nickname"}
                            errorMessage={errors.nickname?.message}
                            registerObj={register("nickname")}
                            placeholder={"닉네임을 2자 이상 입력해주세요."}
                        />
                        <InputGroup
                            wrap={true}
                            label={"이메일"}
                            id={"email"}
                            errorMessage={errors.email?.message}
                            registerObj={register("email")}
                            type={"email"}
                        />
                        <InputGroup
                            wrap={true}
                            label={"전화번호"}
                            id={"phoneNumber"}
                            errorMessage={errors.phoneNumber?.message}
                            registerObj={register("phoneNumber")}
                            type={"tel"}
                        />
                        <InputGroup
                            wrap={true}
                            label={"생년월일"}
                            id={"birthdate"}
                            errorMessage={errors.birthdate?.message}
                            registerObj={register("birthdate")}
                            type={"date"}
                        />
                        <SelectGroup
                            wrap={true}
                            label={"성별"}
                            id={"gender"}
                            errorMessage={errors.gender?.message}
                            registerObj={register("gender")}>
                            <option value={""}>성별을 선택해주세요</option>
                            <option value={Gender.MALE}>남성</option>
                            <option value={Gender.FEMALE}>여성</option>
                        </SelectGroup>
                        <SelectGroup
                            wrap={true}
                            label={"종류"}
                            id={"role"}
                            errorMessage={errors.role?.message}
                            registerObj={register("role")}>
                            <option value={""}>종류를 선택해주세요</option>
                            <option value={Role.ADMIN}>관리자</option>
                            <option value={Role.USER}>일반 사용자</option>
                        </SelectGroup>
                        <div style={{ width: "100%", gap: "32px" }}>
                            {errors.root && (
                                <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>
                            )}
                            <AdminButtonGroup>
                                <Button
                                    color={"secondary"}
                                    variant={"text"}
                                    as={Link}
                                    to={"/admin/user"}>
                                    취소
                                </Button>
                                <Button
                                    type={"submit"}
                                    color={"primary"}
                                    variant={"contained"}
                                    disabled={isSubmitting}>
                                    등록
                                </Button>
                            </AdminButtonGroup>
                        </div>
                    </AdminForm>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminUserUpdatePage;
