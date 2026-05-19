import styled from "styled-components";

export const AdminContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

export const AdminPageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

export const AdminTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
`;

export const AdminLoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${props => props.theme.colors.text.disabled};
`;

// pc에서는 상관 없는데,  모바일 때문에 한 번 테이블을 감싸는 것
export const AdminTableWrapper = styled.div`
    overflow-x: auto; // x축 방향으로 스크롤바를 허용하겠다.
`;

export const AdminTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const AdminTh = styled.th<{ $width?: string }>`
    width: ${props => props.$width};
    text-align: left;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    color: ${props => props.theme.colors.text.disabled};
    font-size: 13px;
    font-weight: 600;
    border-bottom: 2px solid ${props => props.theme.colors.divider};
`;

export const AdminTd = styled.td`
    // td는 flex를 쓸 수 없음
    // 그 안에 들어가는 요소에 대한 정렬은 text-align과 vertical-align을 통해서 해야 함
    padding: 16px;
    font-size: 14px;
    border-bottom: 1px solid ${props => props.theme.colors.divider};
    vertical-align: middle;
`;

export const AdminForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

export const AdminButtonGroup = styled.div<{ $align?: "right" | "center" | "left" }>`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: ${({ $align = "right" }) =>
        $align === "right" ? "flex-end" : $align === "center" ? "center" : "flex-start"};
`;
