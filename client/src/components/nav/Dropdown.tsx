import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

interface DropdownProps {
  label: string;
  items: string[];
  navigateTo?: string;
}

export const Dropdown = ({ label, items, navigateTo }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLabelClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    } else {
      window.location.href = '/'; // navigateTo가 없으면 기본적으로 '/'로 이동
    }
    setIsOpen(false);
  };

  return (
    <DropdownWrapper onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <DropdownLabel onClick={handleLabelClick}>{label}</DropdownLabel>
      {isOpen && (
        <DropdownList>
          {items.map((item, index) => {
            let itemPath: string;

            switch (label) {
              case '마이페이지':
                switch (item) {
                  case '내 강의': // ⭐ 이 부분이 나의 강의 관리 페이지로 변경됨 ⭐
                    itemPath = '/mypage/student/my-courses';
                    break;
                  case '내 리뷰':
                    itemPath = '/mypage/student/my-reviews';
                    break;
                  case '결제 내역':
                    itemPath = '/mypage/student/payments';
                    break;
                  case '설정':
                    itemPath = '/mypage/student/settings';
                    break;
                  case '문의 내역':
                    itemPath = '/mypage/student/inquiry';
                    break;
                  default:
                    itemPath = '/mypage/student/settings'; // 폴백 경로
                    break;
                }
                break;
              // 다른 드롭다운 레이블에 대한 처리 (예: '게시판')
              case '게시판':
                switch (item) {
                  case '전체 게시판':
                    itemPath = '/boards';
                    break;
                  // 다른 게시판 항목 추가
                  default:
                    itemPath = '/boards';
                    break;
                }
                break;
              default:
                if (navigateTo) {
                  const itemSlug = item.toLowerCase().replace(/ /g, '-');
                  itemPath = `${navigateTo}/${itemSlug}`;
                } else {
                  itemPath = `/${item.toLowerCase().replace(/ /g, '-')}`;
                }
                break;
            }

            return (
              <DropdownItemLink key={index} to={itemPath} onClick={() => setIsOpen(false)}>
                {item}
              </DropdownItemLink>
            );
          })}
        </DropdownList>
      )}
    </DropdownWrapper>
  );
};

const DropdownWrapper = styled.div`
  position: relative;
  cursor: pointer;
  z-index: 10;
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
  margin: 0;
`;

const DropdownItemLink = styled(Link)`
  padding: 10px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  white-space: nowrap;
  text-decoration: none;
  display: block;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
  }
`;
