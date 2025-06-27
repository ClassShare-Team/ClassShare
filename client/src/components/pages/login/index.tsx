import React, { useState } from 'react';
import styled from 'styled-components';
import googleIcon from '@/assets/google-icon.png';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/oauth/google';
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 401)
          return alert('이메일 또는 비밀번호가 일치하지 않습니다. 다시 확인해주세요');
        return alert('로그인 실패');
      }

      const result = await res.json();

      if (!result.accessToken) {
        return alert('로그인 실패: 토큰이 없습니다.');
      }

      localStorage.setItem('accessToken', result.accessToken);
      alert('로그인 성공');
      window.location.href = '/main';
    } catch {
      alert('로그인 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <PageContainer>
      <Frame>
        <Title>로그인</Title>
        <OAuthButton onClick={handleGoogleLogin}>
          <img src={googleIcon} alt="Google Icon" />
          Login With Google
        </OAuthButton>
        <DummySpace />
        <DivideLine>
          <DivideText>또는</DivideText>
        </DivideLine>
        <DummySpace />
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton onClick={handleLogin}>로그인</LoginButton>
        <SubmitButton
          onClick={() => {
            window.location.href = '/register';
          }}
        >
          이메일로 가입하기
        </SubmitButton>
      </Frame>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Frame = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  border-radius: 20px;
  width: 525px;
  padding: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.div`
  ${({ theme }) => theme.fonts.h1}
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 10px;
  padding: 16px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.purple};
  border: none;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.white};
  padding: 14px;
  font-size: 16px;
  cursor: pointer;
`;

const LoginButton = styled.button`
  background: ${({ theme }) => theme.colors.purple};
  border: none;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.white};
  padding: 14px;
  font-size: 16px;
  cursor: pointer;
`;

const DummySpace = styled.div`
  height: 6px;
`;

const OAuthButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #fefefe;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 10px;
  padding: 14px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  img {
    width: 20px;
    height: 20px;
  }
`;

const DivideLine = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray400};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const DivideText = styled.span`
  padding: 0 10px;
  white-space: nowrap;
`;
