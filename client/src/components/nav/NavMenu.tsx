import styled from 'styled-components';
import { Dropdown } from './Dropdown';
import { Link } from 'react-router-dom';

export const NavMenu = () => {
  return (
    <MenuWrapper>
      <Dropdown label="강의" items={['교육', '개발', '음악', '요리', '운동', '예술', '글쓰기']} />
      <StyledLink to="/boards">게시판</StyledLink>
    </MenuWrapper>
  );
};

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  height: 100%;
`;

const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray400};
  padding: 8px 0;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.purple};
  }
`;
