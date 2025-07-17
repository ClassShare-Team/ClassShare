import { useState } from 'react';
import styled from 'styled-components';
import useMyPageInfo from '@/components/hooks/useMyPageInfo';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StudentSettingsPage = () => {
  const { userInfo } = useMyPageInfo();
  const [nickname, setNickname] = useState(userInfo?.nickname || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatPhone = (raw: string) => {
    return raw.replace(/[^\d]/g, '').replace(/^(\d{3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  };

  const handleProfileSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (nickname.trim()) formData.append('nickname', nickname.trim());
      if (phone.trim()) formData.append('phone', phone.trim());

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('프로필 수정 실패');
      toast.success('프로필이 수정되었습니다.');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword.trim() || !password.trim()) {
      return toast.warning('현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: password,
        }),
      });
      if (!res.ok) throw new Error('비밀번호 변경 실패');
      toast.success('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setPassword('');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // 응답:500 | 요청: DELETE /users/me | 백엔드 로그 확인 필요한 상황
  const handleDeleteAccount = async () => {
    const confirm = window.confirm('정말로 회원 탈퇴하시겠습니까? 복구할 수 없습니다.');
    if (!confirm) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!res.ok) throw new Error('회원 탈퇴 실패');
      toast.success('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('accessToken');
      navigate('/');
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('알 수 없는 오류가 발생했습니다.');
    }
  };

  if (!userInfo) return <div>유저 정보를 불러오는 중입니다...</div>;

  return (
    <Container>
      <h2>설정</h2>

      <Label>닉네임</Label>
      <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />

      <Label>전화번호</Label>
      <Input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />

      <SaveButton onClick={handleProfileSave} disabled={loading}>
        {loading ? '저장 중...' : '프로필 저장'}
      </SaveButton>

      <Label>현재 비밀번호</Label>
      <Input
        type="password"
        value={currentPassword}
        placeholder="현재 비밀번호"
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <Label>새 비밀번호</Label>
      <Input
        type="password"
        value={password}
        placeholder="새 비밀번호"
        onChange={(e) => setPassword(e.target.value)}
      />

      <SaveButton onClick={handlePasswordChange}>비밀번호 변경</SaveButton>

      <WithdrawButton onClick={handleDeleteAccount}>회원 탈퇴</WithdrawButton>
    </Container>
  );
};

export default StudentSettingsPage;

const Container = styled.div`
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
`;

const Label = styled.label`
  display: block;
  margin-top: 20px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 6px;
`;

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.colors.purple};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const WithdrawButton = styled.button`
  margin-top: 20px;
  padding: 10 16px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;
