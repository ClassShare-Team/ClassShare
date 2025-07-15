import React from 'react';
import styled from 'styled-components';
import logoImg from '@/assets/logo.png';

interface LogoProps {
  onClick?: () => void;
}

export const Logo = ({ onClick }: LogoProps) => {
  return (
    <Wrapper onClick={onClick}>
      <Image src={logoImg} alt="classShare 로고" />
      <Text>ClassShare</Text>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
`;

const Text = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
`;
