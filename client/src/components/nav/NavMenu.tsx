import styled from 'styled-components';
import { Dropdown } from './Dropdown';

export const NavMenu = () => {
  return (
    <MenuWrapper>
      <Dropdown label="강의" items={['교육', '개발', '음악', '요리', '운동', '예술', '글쓰기']} />
      <Dropdown label="수강 중인 강의" items={['내 강의실', '진도 현황']} />
      <Dropdown label="게시판" items={['전체 게시판']} navigateTo="/boards" />
      <Dropdown label="쉐어톡" items={['오픈 쉐어톡', '1:1 쉐어톡']} />
      {/* ✨ 마이페이지 Dropdown 추가 ✨ */}
      <Dropdown
        label="마이페이지"
        // items를 문자열 배열로 유지합니다.
        // Dropdown 컴포넌트가 navigateTo와 각 item 문자열을 조합하여 최종 경로를 만들도록 가정합니다.
        // 예: "/mypage" + "/내 정보" (실제로는 슬러그 형태로 변환될 것으로 예상: "/mypage/내-정보")
        items={['내 강의', '내 리뷰', '결제 내역', '설정', '문의 내역']}
        navigateTo="/mypage/student" // ✨ 여기에 "/mypage/student"를 기본 경로로 지정합니다.
        // 각 item이 이 기본 경로 뒤에 붙어 최종 경로를 만듭니다.
        // 예: /mypage/student/내-정보
      />
    </MenuWrapper>
  );
};

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  height: 100%;
`;
