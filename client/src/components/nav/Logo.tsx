import styled from 'styled-components';
import logoImg from '@/assets/logo.png';

interface LogoProps {
  onClick?: (e: React.MouseEvent) => void;
}

export const Logo = ({ onClick }: LogoProps) => {
  return (
    <Wrapper onClick={onClick}>
      <Image src={logoImg} alt="ClassShare 로고" />
      <Text>ClassShare</Text>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
`;

const Text = styled.div`
  font-size: 20px;
  font-weight: 700;
  user-select: none;
  color: ${({ theme }) => theme.colors.black};
`;
