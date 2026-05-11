import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    
    body {
        font-family: "Pretendard Variables", san-serif;
        background-color: ${props => props.theme.colors.background.default};
        color: ${props => props.theme.colors.text.default};
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        cursor: pointer;
        border: none;
        background: none;
        font-family: inherit;
    }

    input, textarea {
        font-family: inherit;

        &:hover {
            outline: none;
        }
    }
`;
