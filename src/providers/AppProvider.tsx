import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../api/auth";
import type { UserInfoDto } from "../@types/synapse";

type AppContextValue = {
  user: UserInfoDto | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  refreshSession: () => Promise<void>;
  login: (dto: Parameters<typeof loginRequest>[0]) => Promise<UserInfoDto>;
  register: (
    dto: Parameters<typeof registerRequest>[0],
  ) => Promise<UserInfoDto>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfoDto | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const refreshSession = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    void (async () => {
      try {
        const currentUser = await getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoadingSession(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoadingSession,
      refreshSession,
      login: async (dto) => {
        const loggedInUser = await loginRequest(dto);
        setUser(loggedInUser);
        return loggedInUser;
      },
      register: async (dto) => {
        const registeredUser = await registerRequest(dto);
        setUser(registeredUser);
        return registeredUser;
      },
      logout: async () => {
        await logoutRequest();
        setUser(null);
      },
    }),
    [isLoadingSession, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};

export default AppProvider;
