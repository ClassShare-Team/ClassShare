import styled from 'styled-components';
import { useState } from 'react';
import { toast } from 'react-toastify';

const packages = [5000, 10000, 20000, 50000, 100000];

const PointPage = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!selectedAmount) {
      toast.warn('충전 패키지를 선택해주세요');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      const res = await fetch(`${import.meta.env.VITE_API_URL}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ package_id: `package_${selectedAmount}` }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || '충전 실패');

      toast.success(`${data.total_point.toLocaleString()}포인트 충전되었습니다.`);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('충전 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const calculateBonusPoint = (amount: number) => {
    const bonus = amount * 0.1;
    const total = amount + bonus;
    return { bonus, total };
  };

  return (
    <Container>
      <Title>포인트 충전</Title>
      <Package>
        {packages.map((amount) => {
          const { bonus, total } = calculateBonusPoint(amount);
          return (
            <PackageItem
              key={amount}
              $active={amount === selectedAmount}
              onClick={() => setSelectedAmount(amount)}
            >
              <div>{amount.toLocaleString()}포인트 결제</div>
              <div> → {total.toLocaleString()}포인트 지급</div>
              <small>(+{bonus.toLocaleString()}보너스 포인트 지급)</small>
            </PackageItem>
          );
        })}
      </Package>
      <ChargeButton onClick={handlePurchase} disabled={loading}>
        {loading ? '충전 중' : '충전하기'}
      </ChargeButton>
    </Container>
  );
};

export default PointPage;

const Container = styled.div`
  padding: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const Package = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const PackageItem = styled.div<{ $active: boolean }>`
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.purple : '#ccc')};
  background-color: ${({ $active }) => ($active ? '#f8f0ff' : '#fff')};
  box-shadow: ${({ $active }) => ($active ? '0 0 12px rgba(128, 0, 255, 0.3)' : 'none')};
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  min-width: 160px;
  text-align: center;
  transition: all 0.2s ease;
`;

const ChargeButton = styled.button`
  margin-top: 24px;
  padding: 12px 20px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.colors.purple};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
