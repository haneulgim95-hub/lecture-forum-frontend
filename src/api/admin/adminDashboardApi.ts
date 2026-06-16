import axiosInstance from "../axiosInstance.ts";
import type { DashboardSummary } from "../../types/dashboard.type.ts";

const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
    const response = await axiosInstance.get("/admin/summary");
    return response.data.data;
};

export default { fetchDashboardSummary };