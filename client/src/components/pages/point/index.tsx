import styled from 'styled-components';

const PointPage = () => {
  return (
    <Container>
      <Title>포인트 충전</Title>
      <Content>포인트 충전 UI 들어갈 부분</Content>
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

const Content = styled.div`
  margin-top: 20px;
`;
