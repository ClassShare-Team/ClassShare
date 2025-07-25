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
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const fetchUser = async (token: string | null) => {
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      console.error('유저 정보 불러오기 실패:', error);
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  };

  const refetchUser = async () => {
    await fetchUser(accessToken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setAccessToken(storedToken);

    if (storedToken) fetchUser(storedToken);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('accessToken');
      const updatedUser = localStorage.getItem('user');

      setAccessToken(updatedToken);
      if (updatedUser) {
        try {
          const parsedUser = JSON.parse(updatedUser);
          if (parsedUser?.id && parsedUser?.nickname) {
            setUser(parsedUser);
          } else {
            setUser(null);
          }
        } catch (e) {
          console.error('localStorage에서 user 정보 파싱 실패:', e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', String(userData.id));
    localStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, accessToken, setAccessToken, login, logout, refetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser가 UserProvider 내부에서 사용되지 않음');
  return context;
};
