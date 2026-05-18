import styled from "styled-components";
import { Link, useLocation } from "react-router";
import { FiGrid, FiHome, FiUser } from "react-icons/fi";

const adminNavList = [
    {
        path: "/admin/category",
        icon: <FiGrid size={18} />,
        label: "카테고리 관리",
    },
    {
        path: "/admin/user",
        icon: <FiUser size={18}/>,
        label: "유저관리,",
    },
    {
        path: "/",
        icon: <FiHome size={18} />,
        label: "서비스로 돌아가기"
    },
];

function AdminAside() {
    const location = useLocation();
    return (
        <AdminSidebar>
            <SidebarHeader to={"/admin"}>관리자 센터</SidebarHeader>
            <SidebarMenu>
                {adminNavList.map((item, index) => {
                    const isActive = item.path === location.pathname;
                    return (
                    <MenuItem to={item.path} key={index} $isActive={isActive}>
                        {item.icon}
                        {item.label}
                    </MenuItem>
                )})}
            </SidebarMenu>
        </AdminSidebar>
    );
}

export default AdminAside;

const AdminSidebar = styled.aside`
    width: 260px;
    background-color: ${props => props.theme.colors.background.paper};
    border-right: 1px solid ${props => props.theme.colors.divider};
    display: flex;
    flex-direction: column;
`;

const SidebarHeader = styled(Link)`
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    font-size: 20px;
    font-weight: 800;
    color: ${props => props.theme.colors.primary};
    border-bottom: 1px solid ${props => props.theme.colors.divider};
`;

const SidebarMenu = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    gap: 8px;
`;

const MenuItem = styled(Link)<{$isActive: boolean}>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 500;
    color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.text.default};
    background-color: ${props => props.$isActive ? `${props.theme.colors.primary}15` : "transparent"};
    border-left: 4px solid ${props => props.$isActive ? props.theme.colors.primary : "transparent"}
    transition: all 0.2s;

    &:hover {
        background-color: ${props => props.theme.colors.background.default};
        color: ${props => props.theme.colors.primary};
    }
`;