import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Payment {
  id: number;
  lectureTitle: string;
  amount: number;
  paidAt: string;
  method: string;
}

const StudentPaymentHistoryPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/student/payment-history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!res.ok) throw new Error('결제 내역을 불러오지 못했습니다.');
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <PaymentHistoryContainer>
      <Title>결제 내역</Title>
      <Description>강의 결제 내역을 확인할 수 있습니다.</Description>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>강의명</th>
              <th>금액</th>
              <th>결제일</th>
              <th>결제수단</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item) => (
              <tr key={item.id}>
                <td>{item.lectureTitle}</td>
                <td>{item.amount.toLocaleString()}원</td>
                <td>{item.paidAt}</td>
                <td>{item.method}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </PaymentHistoryContainer>
  );
};

export default StudentPaymentHistoryPage;

const PaymentHistoryContainer = styled.div`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  ${({ theme }) => theme.fonts.h1};
  font-size: 24px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.black};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 24px;
`;

const TableWrapper = styled.div`
  margin-top: 24px;
  overflow-x: auto;
`;

const Table = styled.table`
  min-width: 100%;
  border-collapse: collapse;

  thead {
    background-color: ${({ theme }) => theme.colors.gray100};
  }

  th,
  td {
    padding: 12px 24px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  }
`;
