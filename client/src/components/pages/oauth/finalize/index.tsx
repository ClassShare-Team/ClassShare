import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '@/contexts/UserContext';

export const OAuthFinalizePage = () => {
  const [form, setForm] = useState({
    nickname: '',
    role: '',
  });
  const [tempToken, setTempToken] = useState('');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setUser } = useUser();

  useEffect(() => {
    // 기존 유저
    const token = params.get('token');
    // 신규 유저
    const temp = params.get('tempToken');

    if (token) {
      // 기존 유저 : accessToken 저장 후 이동
      localStorage.setItem('accessToken', token);
      toast.success('로그인 성공!');
      navigate('/main');
    } else if (temp) {
      // 신규 유저 : 폼 입력 받음
      setTempToken(temp);
    } else {
      toast.error('유효하지 않은 접근입니다.');
      navigate('/');
    }
  }, [params, navigate]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nickname || !form.role) {
      toast.error('닉네임과 역할을 모두 입력해주세요.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/oauth/finalize`, {
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
        localStorage.setItem('userId', String(result.user.id));
        setUser(result.user);
        toast.success('회원가입이 완료되었습니다');
        navigate('/main');
      } else {
        toast.error('회원가입 실패');
      }
    } catch {
      toast.error('서버 오류 발생');
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
        <Select value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
          <option value="">역할선택</option>
          <option value="student">학생</option>
          <option value="instructor">강사</option>
        </Select>
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

const Select = styled.select`
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
