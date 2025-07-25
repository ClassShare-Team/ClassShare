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
  const { user, setUser } = useUser();

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

    if (!user || !setUser) {
      toast.error('유저 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
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

      const addedPoint = Number(data.total_point) || 0;
      const currentBalance = Number(user.point_balance) || 0;
      const newBalance = currentBalance + addedPoint;

      const updatedUser = {
        ...user,
        point_balance: newBalance,
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('충전 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>충전할 포인트</Title>
      <PackageList>
        {packages.map((pkg) => {
          const total = pkg.amount + pkg.bonus;
          return (
            <PackageOption key={pkg.id}>
              <label>
                <RadioInput
                  type="radio"
                  name="point-package"
                  checked={pkg.id === selectedPackageId}
                  onChange={() => setSelectedPackageId(pkg.id)}
                />
                <ChargePoint>
                  <div>
                    {pkg.price.toLocaleString()} P (+ {pkg.bonus.toLocaleString()}P)
                  </div>
                  <TotalText>Total: {total.toLocaleString()}P</TotalText>
                </ChargePoint>
              </label>
            </PackageOption>
          );
        })}
      </PackageList>
      <ChargeButton onClick={handlePurchase} disabled={loading}>
        {loading ? '충전 중' : '충전하기'}
      </ChargeButton>
    </Container>
  );
};

export default PointPage;

const Container = styled.div`
  padding: 40px;
  max-width: 500px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const PackageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PackageOption = styled.div`
  border: 1px solid #000;
  border-radius: 8px;
  padding: 16px;
`;

const ChargePoint = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TotalText = styled.div`
  font-weight: bold;
  color: #444;
`;

const RadioInput = styled.input`
  margin-right: 12px;
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
  width: 100%;
`;
