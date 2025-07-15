import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  role: 'student' | 'instructor';
  profile_image: string | null;
  point_balance: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  // ✨ 'loading' 속성을 UserContextType 인터페이스에 추가
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // ✨ 'loading' 상태 변수 추가 및 초기값 설정
  const [loading, setLoading] = useState(true); // 초기값은 true (로딩 중)

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false); // 토큰이 없으면 로딩 완료
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        // ✨ 데이터 페치 성공/실패 여부와 관계없이 로딩 완료
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✨ value 객체에 'loading' 상태도 함께 전달
  return <UserContext.Provider value={{ user, setUser, loading }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser는 UserProvider 내부에서 사용되어야 합니다.');
  return context;
};
