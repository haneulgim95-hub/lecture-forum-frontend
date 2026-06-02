import styled from "styled-components";

const Textarea = styled.textarea<{ $hasError: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    border: 1px solid
        ${props => (props.$hasError ? props.theme.colors.error : props.theme.colors.divider)};
    border-radius: 8px;
    font-size: 15px;
    color: ${props => props.theme.colors.text.default};
    transition: all 0.5s;
    min-height: 40px;  // 최소 높이 제한
    resize: vertical;       // 사용자가 높이에 대해서만 크기를 조정 할수있음 (none: 사용자가 조정할수없음) 

    &::placeholder {
        ${props => props.theme.colors.text.disabled};
    }

    &:focus {
        border-color: ${props =>
            props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    }
`;

export default Textarea;