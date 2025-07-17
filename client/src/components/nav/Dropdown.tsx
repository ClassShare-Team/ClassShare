import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface DropdownProps {
  label: string;
  items: string[];
  navigateTo?: string;
}

export const Dropdown = ({ label, items, navigateTo }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (item: string) => {
    localStorage.setItem('selectedCategory', item);
    if (navigateTo) {
      navigate(navigateTo);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <DropdownWrapper onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <DropdownLabel>{label}</DropdownLabel>
      {isOpen && (
        <DropdownList>
          {items.map((item, index) => (
            <DropdownItem key={index} onClick={() => handleClick(item)}>
              {item}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
};

const DropdownWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const DropdownLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray400};
  padding: 8px 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.purple};
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  min-width: 160px;
  max-width: 240px;
  width: max-content;
  padding: 8px 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  list-style: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    width: 0;
    height: 0;
    border-style: solid;
  }

  &::before {
    left: 12px;
    margin-left: -9px;
    border-width: 9px;
    border-color: transparent transparent ${({ theme }) => theme.colors.gray200} transparent;
  }

  &::after {
    left: 12px;
    margin-left: -8px;
    border-width: 8px;
    border-color: transparent transparent ${({ theme }) => theme.colors.white} transparent;
    margin-bottom: -1px;
  }
`;

const DropdownItem = styled.li`
  padding: 10px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  white-space: normal;
  word-break: keep-all;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
  }
`;
