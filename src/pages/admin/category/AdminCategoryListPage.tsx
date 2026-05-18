import { useEffect, useState } from "react";
import adminCategoryApi from "../../../api/admin/adminCategoryApi.ts";
import type { Category } from "../../../types/category.type.ts";

function AdminCategoryListPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await adminCategoryApi.fetchCategoryList();
                setCategories(data);
            } catch (error) {
                console.error(error);
                alert("카테고리 목록을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        loadCategories().then(() => {});
    }, [])

    return <>fffff</>
}

export default AdminCategoryListPage;