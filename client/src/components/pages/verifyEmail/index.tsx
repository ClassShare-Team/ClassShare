import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { verifyEmailCode, signUpUser } from '@/apis/auth';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');

  const userInfo = location.state;

  if (!userInfo) {
    toast.error('회원가입 정보가 없습니다.');
    navigate('/register');
    return null;
  }

  const handleVerify = async () => {
    try {
      await verifyEmailCode(userInfo.email, code);
      toast.success('이메일 인증 성공');

      await signUpUser(userInfo);
      toast.success('회원가입 완료');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: unknown) {
      const error = err as { message?: string };

      if (error.message?.includes('이비 가입된 이메일')) {
        toast.error('이미 가입된 메일입니다.');
        navigate('/register');
      } else {
        toast.error(error.message || '인증 실패');
      }
    }
  };

  return (
    <PageContainer>
      <Frame>
        <Title>이메일 인증</Title>
        <Input placeholder="인증번호 입력" value={code} onChange={(e) => setCode(e.target.value)} />
        <SubmitButton onClick={handleVerify}>이메일 인증 완료</SubmitButton>
      </Frame>
    </PageContainer>
  );
};

export default VerifyEmailPage;

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
  width: 400px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.div`
  ${({ theme }) => theme.fonts.h2}
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
  padding: 16px;
  font-size: 16px;
  cursor: pointer;
`;
