import React, { useState } from "react";
import styled from "styled-components";

// ---- Styled Components ----
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f4f7fe, #f8faff 60%, #eaf5ff);
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 0 32px 0;
`;

const TokenBox = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 16px 0 rgba(98, 120, 223, 0.10);
  width: 480px;
  padding: 40px 36px 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
`;

const CookieBalance = styled.div`
  background: #f8faff;
  border-radius: 16px;
  padding: 18px 0;
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #6253e8;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const CookieIcon = styled.span`
  display: inline-block;
  font-size: 1.5rem;
  vertical-align: middle;
`;

const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TokenItem = styled.div`
  background: #f8faff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  font-size: 1.04rem;
`;

const TokenDesc = styled.div`
  font-weight: 500;
  color: #22223b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TokenBtn = styled.button`
  background: #6253e8;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.13s;
  &:hover {
    background: #4437b7;
  }
`;

const Banner = styled.div`
  background: linear-gradient(90deg, #ffe2ae 0%, #ffe6bc 100%);
  border-radius: 16px;
  color: #de7800;
  font-size: 1.04rem;
  font-weight: 500;
  text-align: center;
  margin-top: 24px;
  padding: 14px 0;
`;

const EventBanner = styled.div`
  margin-top: 20px;
  border-radius: 14px;
  background: #eee2fa;
  padding: 16px 0;
  text-align: center;
  color: #845ec2;
  font-weight: 500;
  font-size: 0.98rem;
`;

const cookiePackages = [
  { count: 100, price: 5000 },
  { count: 200, price: 10000 },
  { count: 300, price: 15000 },
  { count: 400, price: 20000 },
  { count: 600, price: 30000 },
  { count: 1000, price: 50000 },
  { count: 2000, price: 100000 },
];

// ---- Main Component ----
export const TokenPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(33);

  // 실제 결제는 없고, 클릭 시 쿠키 증가만 시뮬레이션
  const handleBuy = (count: number) => {
    setBalance((prev) => prev + count);
    alert(`쿠키 ${count}개가 충전되었습니다!`);
  };

  return (
    <PageWrapper>
      <Main>
        <TokenBox>
          <Title>쿠키 구매</Title>
          <CookieBalance>
            <CookieIcon role="img" aria-label="cookie">🥠</CookieIcon>
            현재 보유한 쿠키&nbsp;
            <span style={{ fontWeight: 700, color: "#06bf4a" }}>{balance}개</span>
          </CookieBalance>
          <Banner>
            원하는 쿠키 패키지를 선택하세요.
          </Banner>
          <TokenList>
            {cookiePackages.map((item) => (
              <TokenItem key={item.count}>
                <TokenDesc>
                  <CookieIcon role="img" aria-label="cookie">🥠</CookieIcon>
                  쿠키 {item.count}개
                </TokenDesc>
                <TokenBtn onClick={() => handleBuy(item.count)}>
                  {item.price.toLocaleString()}원
                </TokenBtn>
              </TokenItem>
            ))}
          </TokenList>
          <EventBanner>
            원하는 만큼 쿠키를 선택해 강의를 즐겨보세요!
          </EventBanner>
        </TokenBox>
      </Main>
    </PageWrapper>
  );
};

export default TokenPage;
