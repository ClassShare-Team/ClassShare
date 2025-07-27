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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!res.ok) throw new Error('유저 정보를 불러오지 못했습니다.');

        const data: UserInfo = await res.json();
        setUserInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('알 수 없는 오류'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
};

export default useMyPageInfo;
