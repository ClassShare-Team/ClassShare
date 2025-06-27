import React from 'react';
import styled from 'styled-components';

export const RegisterPage = () => {
  return (
    <PageContainer>
      <Frame>
        <Title>회원가입</Title>
        <RoleContainer>
          <RoleOption>
            <input type="radio" name="role" value="teacher" defaultChecked /> 강사용
          </RoleOption>
          <RoleOption>
            <input type="radio" name="role" value="student" /> 학생용
          </RoleOption>
        </RoleContainer>
        <Input type="email" placeholder="이메일" />
        <Input type="password" placeholder="비밀번호" />
        <InputRow>
          <HalfInput type="text" placeholder="이름" />
          <HalfInput type="text" placeholder="닉네임" />
        </InputRow>
        <SubmitButton>회원가입</SubmitButton>
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

const HalfInput = styled(Input)`
  width: 50%;
  box-sizing: border-box;
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
`;

const RoleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
`;

const RoleOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  input[type='radio'] {
    accent-color: ${({ theme }) => theme.colors.purple};
  }
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
