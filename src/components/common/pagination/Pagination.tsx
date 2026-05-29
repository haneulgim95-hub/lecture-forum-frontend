import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {
    currentPage: number;
    totalPage: number;
    maxVisiblePages?: number;
    onPageChange: (page: number) => void;
};

function Pagination({ currentPage, totalPage, maxVisiblePages = 5, onPageChange }: Props) {
    if (totalPage <= 1) {
        return null;
    }

    const currentBlock = Math.ceil(currentPage / maxVisiblePages);
    const startPage = (currentBlock - 1) * maxVisiblePages + 1;
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPage);
    const pageNumber = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumber.push(i);
    }

    return (
        <PaginationContainer>
            <ArrowButton disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                <FiChevronLeft size={18} />
            </ArrowButton>
            {pageNumber.map(item => (
                <PageNumButton key={item} $isActive={item === currentPage} onClick={() => onPageChange(item)}>
                    {item}
                </PageNumButton>
            ))}
            <ArrowButton disabled={currentPage === totalPage} onClick={() => onPageChange(currentPage + 1)}>
                <FiChevronRight size={18} />
            </ArrowButton>
        </PaginationContainer>
    );
}

export default Pagination;

const PaginationContainer = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 32px;
`;

const PageNumButton = styled.button<{ $isActive: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 36px;
    height: 36px;
    padding: 0 6px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid
        ${props => (props.$isActive ? props.theme.colors.primary : props.theme.colors.divider)};
    background-color: ${props =>
        props.$isActive ? props.theme.colors.primary : props.theme.colors.background.paper};
    color: ${props => (props.$isActive ? "#fff" : props.theme.colors.text.default)};
    transition: all 0.2s;

    &:hover {
        ${props =>
            !props.$isActive &&
            `background-color: ${props.theme.colors.background.default}; color: ${props.theme.colors.primary}`}
    }
`;

const ArrowButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 36px;
    height: 36px;
    padding: 0 6px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid ${props => props.theme.colors.divider};
    background-color: ${props => props.theme.colors.background.paper};
    color: ${props => props.theme.colors.text.default};
    transition: all 0.2s;

    &:hover {
        background-color: ${props => props.theme.colors.background.default};
        color: ${props => props.theme.colors.primary};
    }

    &:disabled {
        color: ${props => props.theme.colors.text.disabled};
        background-color: ${props => props.theme.colors.background.paper};
        border-color: ${props => props.theme.colors.divider};
        cursor: not-allowed;
        opacity: 0.6;
    }
`;
