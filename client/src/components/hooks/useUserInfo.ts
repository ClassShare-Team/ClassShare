import { useUser } from '@/contexts/UserContext';

const useUserInfo = () => {
  const { user } = useUser();
  return { user };
};

export default useUserInfo;
