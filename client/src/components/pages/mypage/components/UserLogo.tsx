import React from 'react';
import styled from 'styled-components';
import DefaultLogo from '@/assets/UserProfileLogo.png';

interface Props {
  src?: string;
}

const UserLogo: React.FC<Props> = ({ src }) => {
  return <Logo src={src || DefaultLogo} alt="유저 로고" />;
};

export default UserLogo;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 16px;
  object-fit: cover;
`;
