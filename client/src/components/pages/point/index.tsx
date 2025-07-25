import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '@/contexts/UserContext';

interface PointPackage {
  id: number;
  name: string;
  price: number;
  amount: number;
  bonus: number;
}

const PointPage = () => {
  const [packages, setPackages] = useState<PointPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { refetchUser } = useUser();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/points/packages`);
        const data = await res.json();
        setPackages(data.packages);
      } catch (err) {
        console.error('패키지 불러오기 실패', err);
        toast.error('패키지 불러오기 실패');
      }
    };
    fetchPackages();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPackageId) {
      toast.warn('충전 패키지를 선택해주세요');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      const res = await fetch(`${import.meta.env.VITE_API_URL}/points/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ package_id: selectedPackageId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || '충전 실패');

      toast.success(`${data.total_point.toLocaleString()}포인트 충전되었습니다.`);
      await refetchUser();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('충전 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>포인트 충전</Title>
        <Package>
          {packages.map((pkg) => {
            const total = pkg.amount + pkg.bonus;
            return (
              <PackageItem
                key={pkg.id}
                $active={pkg.id === selectedPackageId}
                onClick={() => setSelectedPackageId(pkg.id)}
              >
                <div>{Number(pkg.price).toLocaleString()} 포인트 결제 시</div>
                <ChargeText> {total.toLocaleString()} 포인트 충전</ChargeText>
                <small>(+{pkg.bonus.toLocaleString()} 보너스 포인트 지급)</small>
              </PackageItem>
            );
          })}
        </Package>
        <ChargeButton onClick={handlePurchase} disabled={loading}>
          {loading ? '충전 중' : '충전하기'}
        </ChargeButton>
      </Card>
    </Container>
  );
};

export default PointPage;

const Container = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Card = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 800px;
  max-width: 500px;
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(49, 72, 187, 0.09);
  padding: 2.5rem;
  margin-left: 1.5rem;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const Package = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const ChargeText = styled.div`
  color: red;
  font-weight: bold;
`;

const ChargeButton = styled.button`
  margin-top: 24px;
  padding: 12px 20px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.colors.purple};
  color: white;
  border: none;
  border-radius: 8px;
  max-width: 200px;
  align-self: center;
  cursor: pointer;
`;
