import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface SalesSummary {
  totalRevenue: number;
  totalStudents: number;
  monthlySales: {
    month: string;
    amount: number;
  }[];
}

const InstructorSalesReportPage = () => {
  const [sales, setSales] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/instructor/sales`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!res.ok) throw new Error('매출 정보를 불러오지 못했습니다.');
        const data = await res.json();
        setSales(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('알 수 없는 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!sales) return <div>데이터 없음</div>;

  return (
    <Container>
      <h2>매출 리포트</h2>
      <SummaryBox>
        <div>
          <h4>총 수익</h4>
          <p>{sales.totalRevenue.toLocaleString()}원</p>
        </div>
        <div>
          <h4>총 수강생</h4>
          <p>{sales.totalStudents.toLocaleString()}명</p>
        </div>
      </SummaryBox>

      <ChartWrapper>
        <h4>월별 매출</h4>
        <ul>
          {sales.monthlySales.map((m) => (
            <li key={m.month}>
              {m.month}: {m.amount.toLocaleString()}원
            </li>
          ))}
        </ul>
      </ChartWrapper>
    </Container>
  );
};

export default InstructorSalesReportPage;

const Container = styled.div`
  padding: 40px;
`;

const SummaryBox = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  div {
    background: ${({ theme }) => theme.colors.white};
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    flex: 1;
    text-align: center;
  }
  h4 {
    margin-bottom: 10px;
    font-size: 16px;
  }
  p {
    font-size: 20px;
    font-weight: bold;
  }
`;

const ChartWrapper = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  ul {
    padding-left: 20px;
    line-height: 1.8;
  }
`;
