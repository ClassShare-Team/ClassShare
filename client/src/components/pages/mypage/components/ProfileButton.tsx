import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface Props {
  label: string;
  path: string;
}

const ProfileButton: React.FC<Props> = ({ label, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <Button onClick={handleClick} $red={label === '탈퇴'}>
      {label}
    </Button>
  );
};

export default ProfileButton;

const Button = styled.button<{ $red?: boolean }>`
  width: 100%;
  padding: 12px;
  background-color: ${({ $red }) => ($red ? '#ef4444' : 'white')};
  color: ${({ $red }) => ($red ? 'white' : 'black')};
  border: 1px solid black;
  cursor: pointer;
  font-weight: 500;
`;
