import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { UserEntity } from "~/domain/entities/user.entity";
import type {
  IAuthRepository,
  LoginCredentials,
  RegisterData,
} from "~/domain/repositories/auth.repository";
import { authRepository } from "~/core/di/container";

export interface AuthContextValue {
  user: UserEntity | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  readonly children: ReactNode;
  readonly repository?: IAuthRepository;
}

export function AuthProvider({
  children,
  repository = authRepository,
}: AuthProviderProps) {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const userEntity = await repository.getCurrentUser();
      setUser(userEntity);
    } catch (error) {
      setUser(null);
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const userEntity = await repository.login(credentials);
    setUser(userEntity);
  };

  const register = async (data: RegisterData) => {
    const userEntity = await repository.register(data);
    setUser(userEntity);
  };

  const logout = async () => {
    await repository.logout();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      checkAuth,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
