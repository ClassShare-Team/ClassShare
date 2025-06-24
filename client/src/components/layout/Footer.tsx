import React from 'react';
import styled from 'styled-components';
import githubMark from '../../assets/github-mark.png';

const FooterWrapper = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  border-top: 1px solid #d1d5db;
  background-color: ${({ theme }) => theme.colors.white};
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(6, 182, 212, 1), rgba(139, 92, 246, 1));
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
`;

const CenterText = styled.div`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  flex: 1;
`;

const GithubLink = styled.a`
  display: flex;
  align-items: center;
`;

const GithubIcon = styled.img`
  width: 32px;
  height: 32px;
`;

export const Footer = () => {
  return (
    <FooterWrapper>
      <LeftGroup>
        <Logo />
        <Title>ClassShare</Title>
      </LeftGroup>
      <CenterText>
        Developed by 김동민, 김수정, 김진수, 이승우, 이영채, 최현서 | All rights reserved ⓒ
        ClassShare
      </CenterText>
      <GithubLink href="https://github.com/ClassShare-Team" target="_blank" rel="noreferrer">
        <GithubIcon src={githubMark} alt="Github" />
      </GithubLink>
    </FooterWrapper>
  );
};
