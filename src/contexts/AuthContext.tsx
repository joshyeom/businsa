import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  User,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setAuthLoading(false);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Failed to set auth persistence: ", error);
      }
    };
    setAuthPersistence();
  }, []);

  const value: AuthContextType = { currentUser, setCurrentUser };

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};