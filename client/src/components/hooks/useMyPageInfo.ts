import { useEffect, useState } from 'react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  nickname: string;
  role: 'student' | 'instructor';
  phone?: string;
  profile_image?: string;
  point_balance?: number;
  oauth_id: string | null;
  oauth_provider?: string | null;
}

const useMyPageInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!res.ok) {
          throw new Error('유저 정보를 불러오지 못했습니다.');
        }

        const rawData = await res.json();
        const data: UserInfo = rawData.user;
        setUserInfo(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('알 수 없는 오류가 발생했습니다.'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
};

export default useMyPageInfo;
