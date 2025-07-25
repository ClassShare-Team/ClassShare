import styled from 'styled-components';
import { useState } from 'react';
import { toast } from 'react-toastify';

const PointPage = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.warn('충전 패키지를 선택해주세요.');
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
        body: JSON.stringify({ package_id: selectedPackage }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || '충전 실패');

      toast.success(`충전 완료! +${data.total_point} 포인트`);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>포인트 충전</Title>
      <PackageList>
        {[
          { id: 1, amount: 1000 },
          { id: 2, amount: 5000 },
          { id: 3, amount: 10000 },
        ].map((pkg) => (
          <PackageItem
            key={pkg.id}
            $active={pkg.id === selectedPackage}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.amount.toLocaleString()}P
          </PackageItem>
        ))}
      </PackageList>
      <ChargeButton onClick={handlePurchase} disabled={loading}>
        {loading ? '충전 중...' : '충전하기'}
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

const PackageList = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 16px;
`;

const PackageItem = styled.div<{ $active: boolean }>`
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.purple : '#ccc')};
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
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
