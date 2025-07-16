import styled from 'styled-components';

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
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  overflow: hidden;
  border-collapse: collapse; /* 테이블 테두리 중복 제거 */

  thead {
    background-color: ${({ theme }) => theme.colors.gray100};
    th {
      padding: 12px 24px;
      text-align: left;
      font-size: 12px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.gray500};
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
      &:last-child {
        border-bottom: none;
      }
    }
    td {
      padding: 16px 24px;
      white-space: nowrap;
      font-size: 14px;
      color: ${({ theme }) => theme.colors.black};
    }
  }
`;

const StatusText = styled.span<{ status: string }>`
  color: ${({ status }) =>
    status === '결제 완료' ? '#22C55E' : '#F97316'}; /* Green-500 or Orange-500 */
  font-weight: 500;
`;

const PaymentHistory = () => {
  return (
    <PaymentHistoryContainer>
      <Title>결제 내역</Title>
      <Description>여기에 강의 결제 내역을 표시합니다.</Description>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>결제일</th>
              <th>강의명</th>
              <th>결제 금액</th>
              <th>결제 상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024.06.25</td>
              <td>2025 VEI•JON C. Java, Python + CS</td>
              <td>99,000원</td>
              <td>
                <StatusText status="결제 완료">결제 완료</StatusText>
              </td>
            </tr>
            <tr>
              <td>2024.06.15</td>
              <td>JavaScript & TypeScript 기초</td>
              <td>59,000원</td>
              <td>
                <StatusText status="결제 완료">결제 완료</StatusText>
              </td>
            </tr>
            <tr>
              <td>2024.06.01</td>
              <td>React 심화 과정</td>
              <td>129,000원</td>
              <td>
                <StatusText status="결제 대기">결제 대기</StatusText>
              </td>
            </tr>
            {/* 더 많은 결제 내역을 추가할 수 있습니다. */}
          </tbody>
        </Table>
      </TableWrapper>
    </PaymentHistoryContainer>
  );
};

export default PaymentHistory;
