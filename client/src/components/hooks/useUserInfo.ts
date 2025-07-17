import { useUser } from '@/contexts/UserContext';

const useUserInfo = () => {
  const { user, accessToken } = useUser();
  return { user, accessToken };
};

export default useUserInfo;