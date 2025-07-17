import React from 'react';
import styled from 'styled-components';
import UserLogo from './UserLogo';
import ProfileButton from './ProfileButton';

interface Props {
  name: string;
  nickname: string;
  role: 'student' | 'instructor';
  email: string;
  phone: string;
  profileImage?: string;
  buttons: { label: string; path: string }[];
}

const ProfileCard: React.FC<Props> = ({
  name,
  nickname,
  role,
  email,
  phone,
  profileImage,
  buttons,
}) => {
  return (
    <Wrapper>
      <UserLogo src={profileImage} />
      <Card>
        <Info>
          <div>이름 : {name}</div>
          <div>닉네임 : {nickname}</div>
          <div>역할 : {role}</div>
          <div>이메일 : {email}</div>
          <div>번호 : {phone}</div>
        </Info>
        <Divider />
        <ButtonGroup>
          {buttons.map(({ label, path }) => (
            <ProfileButton key={label} label={label} path={path} />
          ))}
        </ButtonGroup>
      </Card>
    </Wrapper>
  );
};

export default ProfileCard;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid black;
  width: 400px;
  padding: 32px;
`;

const Info = styled.div`
  font-size: 14px;
  line-height: 24px;
`;

const Divider = styled.div`
  border-top: 1px solid #d1d5db;
  margin: 24px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
