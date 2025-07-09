const API_BASE = 'http://localhost:5000';

export const sendEmailCode = async (email: string) => {
  const res = await fetch(`${API_BASE}/auth/email/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw await res.json();
};

export const verifyEmailCode = async (email: string, code: string) => {
  const res = await fetch(`${API_BASE}/auth/email/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) throw await res.json();
};

export const signUpUser = async ({
  name,
  nickname,
  email,
  password,
  role,
}: {
  name: string;
  nickname: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
}) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, nickname, email, password, role }),
  });

  if (!res.ok) throw await res.json();
};
