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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
