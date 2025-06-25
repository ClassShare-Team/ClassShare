import { css, createGlobalStyle } from 'styled-components';

export const fonts = {
  h1: css`
    font-size: 36px;
    font-weight: 600;
  `,
  h2: css`
    font-size: 16px;
  `,
};

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', sans-serif;
  }

  body {
    background-color: #fff;
    color: #000;
  }
`;
