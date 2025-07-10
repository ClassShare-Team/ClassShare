import { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { signUpUser } from '@/apis/auth';
import { useNavigate } from 'react-router-dom';

type Role = 'student' | 'instructor';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as Role,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const isPasswordMatch = !!form.password && form.password === form.confirmPassword;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email: string) => /.+@.+\..+/.test(email);

  const handleSendCode = async () => {
    const { name, nickname, email, password, confirmPassword, role } = form;

    if (!name || !nickname || !email || !password || !confirmPassword) {
      return toast.error('모든 항목을 입력해주세요.');
    }
    if (!isValidEmail(email)) {
      return toast.error('이메일을 다시 확인해주세요.');
    }
    if (password.length < 8) {
      return toast.error('비밀번호는 8자 이상이어야 합니다.');
    }
    if (!isPasswordMatch) {
      return toast.error('비밀번호가 일치하지 않습니다.');
    }

    try {
      await signUpUser({ name, nickname, email, password, role });
      toast.success('인증번호가 발송되었습니다.');
      navigate('/verifyEmail', {
        state: { email },
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || '회원가입 실패');
    }
  };

  return (
    <PageContainer>
      <Frame>
        <Title>회원가입</Title>

        <RoleRadio>
          <label>
            <input
              type="radio"
              value="student"
              checked={form.role === 'student'}
              onChange={(e) => handleChange('role', e.target.value)}
            />
            <span /> 학생용
          </label>
          <label>
            <input
              type="radio"
              value="instructor"
              checked={form.role === 'instructor'}
              onChange={(e) => handleChange('role', e.target.value)}
            />
            <span /> 강사용
          </label>
        </RoleRadio>

        <Input
          placeholder="이름"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <Input
          placeholder="닉네임"
          value={form.nickname}
          onChange={(e) => handleChange('nickname', e.target.value)}
        />
        <Input
          placeholder="이메일"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />

        <PasswordInputWrapper>
          <PasswordInput
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            $valid={isPasswordMatch}
          />
          <ToggleButton type="button" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </ToggleButton>
        </PasswordInputWrapper>

        <PasswordInputWrapper>
          <PasswordInput
            type={showPasswordConfirm ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            $valid={isPasswordMatch}
          />
          <ToggleButton type="button" onClick={() => setShowPasswordConfirm((prev) => !prev)}>
            {showPasswordConfirm ? <FiEyeOff /> : <FiEye />}
          </ToggleButton>
        </PasswordInputWrapper>

        <SubmitButton onClick={handleSendCode}>회원가입</SubmitButton>
      </Frame>
    </PageContainer>
  );
};

export default RegisterPage;

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
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.div`
  ${({ theme }) => theme.fonts.h1}
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
`;

const RoleRadio = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 16px;

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }

  input[type='radio'] {
    display: none;
  }

  span {
    width: 18px;
    height: 18px;
    position: relative;
    border: 2px solid ${({ theme }) => theme.colors.gray400};
    border-radius: 50%;
    display: inline-block;
  }

  input[type='radio']:checked + span {
    border-color: ${({ theme }) => theme.colors.purple};
  }

  input[type='radio']:checked + span::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${({ theme }) => theme.colors.purple};
    border-radius: 50%;
  }
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 10px;
  padding: 16px;
  font-size: 16px;
`;

const PasswordInput = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== '$valid',
})<{ $valid?: boolean }>`
  border: 2px solid ${({ $valid, theme }) => ($valid ? 'green' : theme.colors.gray300)};
  border-radius: 10px;
  padding: 16px;
  padding-right: 40px;
  font-size: 16px;
  width: 100%;
`;

const PasswordInputWrapper = styled.div`
  position: relative;
`;

const ToggleButton = styled.button`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.gray400};
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
