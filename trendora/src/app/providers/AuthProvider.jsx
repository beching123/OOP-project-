import { useEffect } from 'react';
import useAuthStore from '../../stores/authStore';

export default function AuthProvider({ children }) {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // Optionally verify token on mount if one exists
    const verifyToken = async () => {
      if (token) {
        try {
          // If we had a real backend, we'd fetch profile here to ensure token is valid
          // const res = await authService.getProfile();
          // setUser(res.data);
        } catch (error) {
          console.error("Failed to verify token", error);
          // logout();
        }
      }
    };
    
    verifyToken();
  }, [token, setUser, logout]);

  return children;
}
