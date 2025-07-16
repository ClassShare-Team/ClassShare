import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

// 실제 백엔드 API의 기본 URL을 여기에 입력해주세요.
const API_BASE_URL = 'http://localhost:5000';

const SettingsContainer = styled.div`
  padding: 40px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  max-width: 850px;
  margin: 40px auto;
  font-family: ${({ theme }) => theme.fontFamily};
`;

const Title = styled.h3`
  ${({ theme }) => theme.fonts.h1};
  font-size: 32px;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  padding-bottom: 20px;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 32px;
  text-align: center;
  line-height: 1.6;
`;

const Section = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  padding-bottom: 40px;
  margin-bottom: 40px;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.black};
  text-align: left;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  width: 140px;
  min-width: 140px;
  color: ${({ theme }) => theme.colors.gray500};
  font-weight: 500;
  margin-right: 30px;
  font-size: 17px;
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 10px;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.black};
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple};
    box-shadow: 0 0 0 4px rgba(122, 54, 255, 0.25);
  }

  &[readOnly] {
    background-color: ${({ theme }) => theme.colors.gray100};
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  margin-top: 30px;
  padding: 14px 28px;
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition:
    background-color 0.2s ease-in-out,
    transform 0.1s ease-in-out;
  width: 100%;

  &:hover {
    transform: translateY(-3px);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray300};
    cursor: not-allowed;
    transform: none;
  }
`;

const SaveButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.purple};
  &:hover {
    background-color: #6a2cdb;
  }
`;

const DeleteAccountButton = styled(Button)`
  background-color: #ef4444;
  &:hover {
    background-color: #dc2626;
  }
`;

const ProfileImageArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const ProfileImagePreview = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.purple};
  margin-bottom: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
`;

const ProfileImageUploadButton = styled.label`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.black};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }

  input[type='file'] {
    display: none;
  }
`;

const Settings = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [profileName, setProfileName] = useState(user?.name || ''); // 닉네임 -> 백엔드 'name' 필드
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState<string>(
    user && 'phone' in user && user.phone ? user.phone : ''
  );
  const [profileImage, setProfileImage] = useState(
    user?.profile_image || 'https://placehold.co/120x120/7a36ff/FFFFFF?text=User'
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [initialProfileData, setInitialProfileData] = useState({
    name: user?.name || '',
    phone: user && 'phone' in user && user.phone ? user.phone : '',
    profile_image: user?.profile_image || 'https://placehold.co/120x120/7a36ff/FFFFFF?text=User',
  });

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfilePhone(user && 'phone' in user && user.phone ? user.phone : '');
      setProfileImage(user.profile_image || 'https://placehold.co/120x120/7a36ff/FFFFFF?text=User');
      setInitialProfileData({
        name: user.name,
        phone: user && 'phone' in user && user.phone ? user.phone : '',
        profile_image: user.profile_image || 'https://placehold.co/120x120/7a36ff/FFFFFF?text=User',
      });
    } else {
      setProfileName('');
      setProfileEmail('');
      setProfilePhone('');
      setProfileImage('https://placehold.co/120x120/7a36ff/FFFFFF?text=User');
      setInitialProfileData({ name: '', phone: '', profile_image: '' });
      toast.info('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setProfileImage(
        user?.profile_image || 'https://placehold.co/120x120/7a36ff/FFFFFF?text=User'
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error('로그인 정보가 없어 회원 탈퇴를 진행할 수 없습니다.');
      return;
    }
    if (!window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        toast.success('회원 탈퇴가 완료되었습니다.');
        setUser(null);
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        const apiResponse = await response.json();
        let errorMessage = '회원 탈퇴 중 오류가 발생했습니다.';
        if (response.status === 401) {
          errorMessage = '인증 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.';
          setUser(null);
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else if (response.status === 404) {
          errorMessage = '사용자를 찾을 수 없습니다.';
        }
        toast.error(apiResponse.message || errorMessage);
      }
    } catch (error) {
      console.error('회원 탈퇴 요청 중 오류 발생:', error);
      toast.error('네트워크 오류 또는 서버 응답 문제 발생.');
    }
  };

  const handleChangePassword = async () => {
    if (!user) {
      toast.error('로그인 정보가 없어 비밀번호 변경을 진행할 수 없습니다.');
      return;
    }

    if (!currentPassword || !newPassword) {
      toast.error('현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword === currentPassword) {
      toast.error('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const apiResponse = await response.json();

      if (response.ok) {
        toast.success(apiResponse.message || '비밀번호가 성공적으로 변경되었습니다.');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        let errorMessage = '비밀번호 변경 중 오류가 발생했습니다.';
        if (response.status === 401) {
          errorMessage = '인증 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.';
          setUser(null);
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else if (response.status === 403) {
          errorMessage = '현재 비밀번호가 일치하지 않습니다.';
        }
        toast.error(apiResponse.message || errorMessage);
      }
    } catch (error) {
      console.error('비밀번호 변경 요청 중 오류 발생:', error);
      toast.error('네트워크 오류 또는 서버 응답 문제 발생.');
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      toast.error('로그인 정보가 없어 회원 정보 수정을 진행할 수 없습니다.');
      return;
    }

    const formData = new FormData();
    let isChanged = false;

    // 백엔드가 'name' 필드를 기대하므로, 'nickname' 대신 'name'을 사용합니다.
    if (profileName !== initialProfileData.name) {
      formData.append('name', profileName); // ⭐ 변경된 부분 ⭐
      isChanged = true;
    }
    if (profilePhone !== initialProfileData.phone) {
      formData.append('phone', profilePhone);
      isChanged = true;
    }
    if (selectedFile) {
      formData.append('profile_image', selectedFile);
      isChanged = true;
    }

    if (!isChanged) {
      toast.info('수정할 정보가 없습니다.');
      return;
    }

    try {
      // API URL을 백엔드 라우트와 일치시킵니다. (가장 일반적인 프로필 업데이트 엔드포인트)
      // 백엔드가 이 엔드포인트에서 name과 profile_image를 동시에 처리할 수 있어야 합니다.
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        // ⭐ 변경된 부분 ⭐
        method: 'PATCH',
        headers: {
          // FormData를 보낼 때는 Content-Type 헤더를 수동으로 설정하지 않습니다.
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      const apiResponse = await response.json();

      if (response.ok) {
        toast.success(apiResponse.message || '회원 정보가 수정되었습니다.');
        console.log('업데이트된 유저 정보 (API 응답):', apiResponse.user); // 이 로그 결과를 꼭 확인해야 합니다!

        // UserContext 업데이트 로직: 백엔드 응답이 주는 정보를 우선적으로 사용합니다.
        setUser((prevUser) => {
          if (!prevUser) return null;

          return {
            ...prevUser,
            // 'name' 필드 업데이트:
            // 1. apiResponse.user.name이 있으면 사용 (백엔드가 'name'으로 반환할 경우)
            // 2. 없으면 현재 profileName 상태 사용
            name: (apiResponse.user && apiResponse.user.name) || profileName,

            // 'email' 필드 업데이트: 백엔드 응답에 email이 있다면 사용
            email: (apiResponse.user && apiResponse.user.email) || prevUser.email,

            // 'phone' 필드 업데이트: 백엔드 응답이 우선, 없으면 현재 profilePhone 상태 사용
            phone:
              apiResponse.user && 'phone' in apiResponse.user && apiResponse.user.phone
                ? apiResponse.user.phone
                : profilePhone,

            // 'profile_image' 업데이트: 백엔드가 새로운 이미지 URL을 주면 사용, 아니면 현재 임시 이미지 사용
            profile_image:
              apiResponse.profile_image_url ||
              (apiResponse.user && apiResponse.user.profile_image) ||
              profileImage,
          };
        });

        // 초기 데이터 업데이트: 다음 수정 시 변경 여부 판단의 기준이 됩니다.
        setInitialProfileData({
          name: profileName,
          phone: profilePhone,
          profile_image: apiResponse.profile_image_url || profileImage,
        });
        setSelectedFile(null); // 파일 업로드 후 선택된 파일 초기화
      } else {
        let errorMessage = '회원 정보 수정 중 오류가 발생했습니다.';
        if (response.status === 401) {
          errorMessage = '인증 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.';
          setUser(null);
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else if (response.status === 400) {
          errorMessage = '유효하지 않은 요청 데이터입니다.';
        } else if (response.status === 409) {
          errorMessage = apiResponse.message || '중복된 정보가 있습니다.';
        }
        toast.error(apiResponse.message || errorMessage);
      }
    } catch (error) {
      console.error('프로필 정보 수정 요청 중 오류 발생:', error);
      toast.error('네트워크 오류 또는 서버 응답 문제 발생.');
    }
  };

  const isDisabled = !user; // user 객체가 없으면 모든 버튼 비활성화

  return (
    <SettingsContainer>
      <Title>설정</Title>
      <Description>계정 정보 및 알림 설정을 관리합니다.</Description>

      {/* 로그인 상태가 아닐 때 경고 메시지 표시 */}
      {!user && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            borderRadius: '8px',
            color: '#856404',
          }}
        >
          로그인 정보가 없습니다. 이 페이지를 이용하시려면 먼저{' '}
          <a href="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
            로그인
          </a>
          해주세요.
        </div>
      )}

      <Section>
        <SectionTitle>프로필 정보</SectionTitle>
        <ProfileImageArea>
          <ProfileImagePreview src={profileImage} alt="프로필 이미지" />
          <ProfileImageUploadButton htmlFor="profile-image-upload">
            프로필 사진 변경
            <input
              type="file"
              id="profile-image-upload"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isDisabled}
            />
          </ProfileImageUploadButton>
        </ProfileImageArea>

        <FormRow>
          <Label htmlFor="name">이름:</Label> {/* "닉네임"에서 "이름"으로 변경된 레이블 */}
          <Input
            type="text"
            id="name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            disabled={isDisabled}
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="email">이메일:</Label>
          <Input type="email" id="email" value={profileEmail} readOnly disabled={isDisabled} />
        </FormRow>
        <FormRow>
          <Label htmlFor="phone">연락처:</Label>
          <Input
            type="tel"
            id="phone"
            value={profilePhone}
            onChange={(e) => setProfilePhone(e.target.value)}
            disabled={isDisabled}
          />
        </FormRow>
        <SaveButton onClick={handleUpdateProfile} disabled={isDisabled}>
          정보 저장
        </SaveButton>
      </Section>

      <Section>
        <SectionTitle>비밀번호 변경</SectionTitle>
        <FormRow>
          <Label htmlFor="current-password">현재 비밀번호:</Label>
          <Input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isDisabled}
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="new-password">새 비밀번호:</Label>
          <Input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isDisabled}
          />
        </FormRow>
        <SaveButton onClick={handleChangePassword} disabled={isDisabled}>
          비밀번호 변경
        </SaveButton>
      </Section>

      <Section>
        <SectionTitle>회원 탈퇴</SectionTitle>
        <Description>
          회원 탈퇴 시 모든 수강 기록 및 결제 이력이 영구적으로 삭제됩니다. 신중하게 결정해주세요.
        </Description>
        <DeleteAccountButton onClick={handleDeleteAccount} disabled={isDisabled}>
          회원 탈퇴
        </DeleteAccountButton>
      </Section>
    </SettingsContainer>
  );
};

export default Settings;
