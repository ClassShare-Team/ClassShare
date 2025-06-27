import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const OAuthFinalizePage = () => {
  const [form, setForm] = useState({
    nickname: '',
    phone: '',
    birth: '',
  });
  const [tempToken, setTempToken] = useState('');
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    // 기존 유저
    const token = params.get('token');
    // 신규 유저
    const temp = params.get('tempToken');

    if (token) {
      // 기존 유저 : accessToken 저장 후 이동
      localStorage.setItem('accessToken', token);
      alert('로그인 성공!');
      navigate('/main');
    } else if (temp) {
      // 신규 유저 : 폼 입력 받음
      setTempToken(temp);
    } else {
      alert('유효하지 않은 접근입니다.');
      navigate('/');
    }
  }, [params, navigate]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/auth/oauth/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const result = await res.json();
        localStorage.setItem('accessToken', result.accessToken);
        alert('회원가입이 완료되었습니다');
        navigate('/main');
      } else {
        alert('회원가입 실패');
      }
    } catch {
      alert('서버 오류 발생');
    }
  };

  return tempToken ? (
    <PageContainer>
      <Frame>
        <Title>추가 정보 입력</Title>
        <Input
          type="text"
          placeholder="닉네임"
          value={form.nickname}
          onChange={(e) => handleChange('nickname', e.target.value)}
        />
        <Input
          type="text"
          placeholder="휴대폰 번호"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        <Input
          type="date"
          placeholder="생년월일"
          value={form.birth}
          onChange={(e) => handleChange('birth', e.target.value)}
        />
        <SubmitButton onClick={handleSubmit}>계속</SubmitButton>
      </Frame>
    </PageContainer>
  ) : null;
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
  width: 500px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
