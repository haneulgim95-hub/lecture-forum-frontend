import { createBrowserRouter, redirect } from "react-router";
import HomePage from "../pages/HomePage.tsx";
import SignUpPage from "../pages/auth/signup/SignUpPage.tsx";
import SignInPage from "../pages/auth/signin/SignInPage.tsx";
import MainLayout from "../layouts/MainLayout.tsx";
import AdminLayout from "../layouts/admin/AdminLayout.tsx";
import { useAuthStore } from "../stores/auth/authStore.ts";
import { Role } from "../types/user.type.ts";
import AdminCategoryListPage from "../pages/admin/category/AdminCategoryListPage.tsx";

const adminLoader = () => {
    const { isLoggedIn, user } = useAuthStore.getState();

    if (!isLoggedIn) {
        alert("로그인이 필요합니다.");
        return redirect("/auth/signin");
    }

    if (user?.role !== Role.ADMIN) {
        alert("관리자만 접근할 수 있는 페이지입니다");
        return redirect("/");
    }

    // 로그인도 되어있고, 관리자이기도 하다면 통과시켜 준다.
    return null;
};

const guestLoader = () => {
    const { isLoggedIn } = useAuthStore.getState();

    if (isLoggedIn) {
        redirect("/");
    }

    return null;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "auth",
                loader: guestLoader,
                children: [
                    { path: "signin", element: <SignInPage /> },
                    { path: "signup", element: <SignUpPage /> },
                ],
            },
        ],
    },
    {
        path: "/admin",
        loader: adminLoader,
        element: <AdminLayout />,
        children: [
            { path: "category", children: [{ index: true, element: <AdminCategoryListPage /> }] },
        ],
    },
]);

export default router;
