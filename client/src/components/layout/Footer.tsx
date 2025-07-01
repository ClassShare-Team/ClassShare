import React from 'react';
import styled from 'styled-components';
import githubMark from '@/assets/github-mark.png';
import logoImage from '@/assets/logo.png';

export const Footer = () => {
  return (
    <FooterWrapper>
      <FooterInner>
        <LeftGroup>
          <Logo src={logoImage} alt="logo" />
          <Title>ClassShare</Title>
        </LeftGroup>
        <CenterArea>
          <CenterText>
            Developed by 김동민, 김수정, 김진수, 이승우, 이영채, 최현서 | All rights reserved ⓒ
            ClassShare
          </CenterText>
        </CenterArea>
        <GithubLink href="https://github.com/ClassShare-Team" target="_blank" rel="noreferrer">
          <GithubIcon src={githubMark} alt="Github" />
        </GithubLink>
      </FooterInner>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const FooterInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  max-width: 1271px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
`;

const CenterArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const CenterText = styled.div`
  font-size: 14px;
  color: #6b7280;

  @media (max-width: 768px) {
    order: 3;
  }
`;

const GithubLink = styled.a`
  display: flex;
  align-items: center;
`;

const GithubIcon = styled.img`
  width: 32px;
  height: 32px;
`;
export default Footer;
