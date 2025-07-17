import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

// 실제 백엔드 API의 기본 URL을 여기에 입력해주세요.
const API_BASE_URL = 'http://localhost:5000';

// UserContext에서 가져오는 user 객체의 타입을 정의합니다.
// 실제 백엔드 응답에 따라 이 인터페이스를 더 정확하게 구성해야 합니다.
interface User {
  id: string;
  email: string;
  name: string; // 닉네임 대신 'name' 필드 사용
  phone?: string; // 전화번호는 선택 사항일 수 있으므로 '?' 추가
  profile_image?: string; // 프로필 이미지도 선택 사항일 수 있으므로 '?' 추가
  // 다른 사용자 관련 필드가 있다면 여기에 추가합니다.
}

// 초기 프로필 데이터의 타입을 정의합니다.
interface InitialProfileData {
  name: string;
  phone: string;
  profile_image: string;
}

// styled-components 정의 (변경 없음)
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
  // useUser 훅이 반환하는 객체에 User 타입을 적용합니다.
  const { user, setUser } = useUser() as {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
  };
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  // user?.name이 string임을 보장하고, 초기값에 맞게 타입을 지정합니다.
  const [profileName, setProfileName] = useState<string>(user?.name || '');
  const [profileEmail, setProfileEmail] = useState<string>(user?.email || '');
  // user.phone이 존재하고 string 타입인지 확인합니다.
  const [profilePhone, setProfilePhone] = useState<string>(user?.phone || '');
  // profile_image의 초기값에 따라 string 타입을 지정합니다.
  const [profileImage, setProfileImage] = useState<string>(
    user?.profile_image || 'https://placehold.co/120x120/7a36ff/FFFFFF?text=User'
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // InitialProfileData 인터페이스를 적용합니다.
  const [initialProfileData, setInitialProfileData] = useState<InitialProfileData>({
    name: user?.name || '',
    phone: user?.phone || '',
    profile_image: user?.profile_image || 'https://placehold.co/120x120/7a36ff/FFFFFF?text=User',
  });

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfilePhone(user.phone || ''); // phone이 없을 경우 빈 문자열 할당
      setProfileImage(user.profile_image || 'https://placehold.co/120x120/7a36ff/FFFFFF?text=User');
      setInitialProfileData({
        name: user.name,
        phone: user.phone || '', // phone이 없을 경우 빈 문자열 할당
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
        // 백엔드 응답을 위한 타입 단언
        const apiResponse: { message?: string } = await response.json();
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
    } catch (error: unknown) {
      // error 타입 명시
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

      // 백엔드 응답을 위한 타입 단언
      const apiResponse: { message?: string } = await response.json();

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
    } catch (error: unknown) {
      // error 타입 명시
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

    if (profileName !== initialProfileData.name) {
      formData.append('name', profileName);
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
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      // 백엔드 응답의 유저 데이터를 위한 인터페이스 (백엔드 응답에 맞춰 정확히 정의)
      interface UpdateProfileResponse {
        message?: string;
        user?: User; // 업데이트된 유저 정보가 있을 수 있음
        profile_image_url?: string; // 업데이트된 프로필 이미지 URL이 별도로 올 수 있음
      }

      const apiResponse: UpdateProfileResponse = await response.json();

      if (response.ok) {
        toast.success(apiResponse.message || '회원 정보가 수정되었습니다.');
        console.log('업데이트된 유저 정보 (API 응답):', apiResponse.user);

        setUser((prevUser: User | null) => {
          // prevUser에 타입 명시
          if (!prevUser) return null;

          return {
            ...prevUser,
            name: (apiResponse.user && apiResponse.user.name) || profileName,
            email: (apiResponse.user && apiResponse.user.email) || prevUser.email,
            phone: (apiResponse.user && apiResponse.user.phone) || profilePhone,
            profile_image:
              apiResponse.profile_image_url ||
              (apiResponse.user && apiResponse.user.profile_image) ||
              profileImage,
          };
        });

        setInitialProfileData({
          name: profileName,
          phone: profilePhone,
          profile_image: apiResponse.profile_image_url || profileImage,
        });
        setSelectedFile(null);
      } else {
        // apiResponse의 타입을 명시적으로 지정하여 속성 접근 오류 방지
        const errorResponse: { message?: string } = apiResponse;
        let errorMessage = '회원 정보 수정 중 오류가 발생했습니다.';
        if (response.status === 401) {
          errorMessage = '인증 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.';
          setUser(null);
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else if (response.status === 400) {
          errorMessage = '유효하지 않은 요청 데이터입니다.';
        } else if (response.status === 409) {
          errorMessage = errorResponse.message || '중복된 정보가 있습니다.';
        }
        toast.error(errorResponse.message || errorMessage);
      }
    } catch (error: unknown) {
      // error 타입 명시
      console.error('프로필 정보 수정 요청 중 오류 발생:', error);
      toast.error('네트워크 오류 또는 서버 응답 문제 발생.');
    }
  };

  const isDisabled = !user;

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
          <Label htmlFor="name">이름:</Label>
          <Input
            type="text"
            id="name"
            value={profileName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileName(e.target.value)}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfilePhone(e.target.value)}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrentPassword(e.target.value)
            }
            disabled={isDisabled}
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="new-password">새 비밀번호:</Label>
          <Input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
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
