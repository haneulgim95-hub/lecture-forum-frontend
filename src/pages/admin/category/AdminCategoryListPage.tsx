import { useEffect, useState } from "react";
import type {Category} from "../../../types/category.type.ts";
import adminCategoryApi from "../../../api/adminCategoryApi.ts";

function AdminCategoryListPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await adminCategoryApi.fetchCategoryList();
                setCategories(data);
            } catch (error) {
                console.log(error);
                alert("카테고리 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        }
        loadCategories().then(() => {});
    }, []);

    return <>fffff</>
}

export default AdminCategoryListPage;