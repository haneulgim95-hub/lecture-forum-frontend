import styled from "styled-components";

export const PostContainer = styled.div`
    width: 100%;
`;

export const PostPageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
`;

export const PostTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 20px;
    
    // style-components는 css 방식의 스타일링을 제공하는 것이 아니라
    // SCSS (또는 SASS) 방식의 스타일링을 제공하기 때문에
    // 트리를 타고 작성하는 것이 가능함 
    small {
        font-size: 14px;
        font-weight: 400;
        color: ${props => props.theme.colors.secondary};
    }
`;

export const BoardWrapper = styled.div`
    background-color: ${props => props.theme.colors.background.paper};
    border-radius: 8px;
    border: 1px solid ${props => props.theme.colors.divider};
    overflow: hidden;
`;

export const BoardTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    
    thead {
        background-color: ${props => props.theme.colors.background.default};
        border-bottom: 1px solid ${props => props.theme.colors.divider}
        
    }
    
    tbody tr {
        border-bottom: 1px solid ${props => props.theme.colors.divider};
        transition: all 0.2s;
        
        &:last-child {
            border-bottom: none;
        }
        
        &:hover {
            background-color: ${props => props.theme.colors.background.default};
        }
    }
`;

export const BoardTh = styled.th<{$width?: string}>`
    padding: 16px;
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text.disabled};
    text-align: center;
    width: ${props => props.$width || "auto"};
`;

export const BoardTd = styled.td<{$align?: "left" | "center" | "right"}>`
    padding: 16px;
    font-size: 15px;
    text-align: ${props => props.$align || "center"};
    
    &.title-cell {
        text-align: left;
    }
`;

export const LoadingText = styled.div`
    text-align: center;
    padding: 100px 0;
    color: ${props => props.theme.colors.text.disabled};
`;