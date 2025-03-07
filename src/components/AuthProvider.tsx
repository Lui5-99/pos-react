import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";
import { authAPI } from "../services/api";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if there's a token
      if (authAPI.isAuthenticated()) {
        try {
          // Try to get current user data
          const user = await authAPI.getCurrentUser();
          const token = localStorage.getItem("token");
          if (user && token) {
            dispatch(loginSuccess({ user, token }));
          } else {
            // If no user data, clear auth
            authAPI.logout();
          }
        } catch (error) {
          // If error, clear auth
          authAPI.logout();
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
