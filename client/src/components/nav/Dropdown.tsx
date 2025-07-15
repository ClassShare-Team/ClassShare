import React, { useState } from 'react';
import styled from 'styled-components';

interface DropdownProps {
  label: string;
  items: string[];
}

export const Dropdown = ({ label, items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownWrapper onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <DropdownLabel>{label}</DropdownLabel>
      {isOpen && (
        <DropdownList>
          {items.map((item, index) => (
            <DropdownItem key={index} onClick={() => alert(item)}>
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
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 0;
  width: 160px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  list-style: none;
`;

const DropdownItem = styled.li`
  padding: 10px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  white-space: nowrap;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
  }
`;
