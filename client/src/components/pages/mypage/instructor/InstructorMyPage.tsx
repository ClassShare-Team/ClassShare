// import { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import styled from 'styled-components';
// import { useUser } from '@/contexts/UserContext';

// // 서브 컴포넌트 임포트 경로 수정 (./instructor/ 제거)
// import MyLectures from './MyLectures'; // './instructor/MyLectures' -> './MyLectures'
// import MyStudents from './MyStudents'; // './instructor/MyStudents' -> './MyStudents'
// import SalesReport from './SalesReport'; // './instructor/SalesReport' -> './SalesReport'
// import Inquiry from './Inquiry'; // './instructor/Inquiry' -> './Inquiry'
// import Settings from './Settings'; // './instructor/Settings' -> './Settings'

// const MyPageLayout = styled.div`
//   display: flex;
//   flex-direction: column;
//   min-height: 100vh;
//   background-color: ${({ theme }) => theme.colors.gray100};
//   font-family: ${({ theme }) => theme.fontFamily};

//   @media (min-width: 768px) {
//     /* md breakpoint */
//     flex-direction: row;
//   }
// `;

// const Sidebar = styled.aside`
//   width: 100%;
//   background-color: ${({ theme }) => theme.colors.white};
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   padding: 24px;
//   border-radius: 8px;
//   margin-bottom: 24px;

//   @media (min-width: 768px) {
//     width: 256px; /* md:w-64 */
//     border-radius: 8px 0 0 8px; /* md:rounded-l-lg md:rounded-r-none */
//     margin-bottom: 0;
//   }
// `;

// const UserProfile = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 24px;
// `;

// const Avatar = styled.img`
//   width: 60px;
//   height: 60px;
//   border-radius: 50%;
//   border: 2px solid ${({ theme }) => theme.colors.purple};
//   margin-right: 16px;
// `;

// const UserDetails = styled.div`
//   h2 {
//     font-size: 20px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.colors.black};
//   }
//   p {
//     font-size: 14px;
//     color: ${({ theme }) => theme.colors.gray500};
//   }
// `;

// const NavList = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
// `;

// const NavItem = styled.li`
//   margin-bottom: 8px;
// `;

// const NavLink = styled(Link)<{ $active: boolean }>`
//   display: flex;
//   align-items: center;
//   padding: 12px;
//   border-radius: 6px;
//   font-size: 18px;
//   text-decoration: none;
//   transition: all 0.2s ease-in-out;

//   color: ${({ theme, $active }) => ($active ? theme.colors.white : theme.colors.gray500)};
//   background-color: ${({ theme, $active }) => ($active ? theme.colors.purple : 'transparent')};
//   box-shadow: ${({ $active }) => ($active ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none')};

//   &:hover {
//     background-color: ${({ theme, $active }) => ($active ? '#6a2cdb' : theme.colors.gray100)};
//     color: ${({ theme, $active }) => ($active ? theme.colors.white : theme.colors.purple)};
//   }
// `;

// const MainContent = styled.main`
//   flex: 1;
//   padding: 24px;

//   @media (min-width: 768px) {
//     margin-left: 24px; /* md:ml-6 */
//   }
// `;

// const InstructorMyPage = () => {
//   const { user } = useUser();
//   const location = useLocation();
//   const [activeMenu, setActiveMenu] = useState('');

//   useEffect(() => {
//     const pathSegments = location.pathname.split('/');
//     const currentPath = pathSegments[pathSegments.length - 1];
//     setActiveMenu(currentPath || 'my-lectures');
//   }, [location.pathname]);

//   const menuItems = [
//     { name: '내 강의 관리', path: 'my-lectures', component: <MyLectures /> },
//     { name: '수강생 관리', path: 'my-students', component: <MyStudents /> },
//     { name: '수익 관리', path: 'sales-report', component: <SalesReport /> },
//     { name: '1:1 문의', path: 'inquiry', component: <InstructorInquiry /> },
//     { name: '설정', path: 'settings', component: <InstructorSettings /> },
//   ];

//   const renderContent = () => {
//     const foundItem = menuItems.find((item) => item.path === activeMenu);
//     return foundItem ? foundItem.component : <MyLectures />;
//   };

//   return (
//     <MyPageLayout>
//       <Sidebar>
//         <UserProfile>
//           <Avatar
//             src={user?.profile_image || 'https://placehold.co/60x60/7a36ff/FFFFFF?text=Instructor'}
//             alt="Instructor Avatar"
//           />
//           <UserDetails>
//             <h2>{user?.nickname || user?.name || '강사님'}</h2>
//             <p>{user?.email || 'instructor@example.com'}</p>
//           </UserDetails>
//         </UserProfile>

//         <nav>
//           <NavList>
//             {menuItems.map((item) => (
//               <NavItem key={item.path}>
//                 <NavLink to={`/mypage/instructor/${item.path}`} $active={activeMenu === item.path}>
//                   {item.name}
//                 </NavLink>
//               </NavItem>
//             ))}
//           </NavList>
//         </nav>
//       </Sidebar>

//       <MainContent>{renderContent()}</MainContent>
//     </MyPageLayout>
//   );
// };

// export default InstructorMyPage;
