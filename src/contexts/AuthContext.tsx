import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User, setPersistence, browserSessionPersistence } from "firebase/auth";
import { fetchUserData } from "../utils/fetchUserData";

type UserRoleType = "buyer" | "seller" | null; // userRole을 null을 포함하도록 설정

const AuthContext = createContext<UserRoleType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return { userRole: context }; // userRole을 반환하는 방식
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRoleType>(null); // userRole 초기값을 null로 설정

  useEffect(() => {
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setUserRole(null); // 유저가 없으면 역할도 null로 설정
            setAuthLoading(false); // 로딩 종료
            return;
          }

          setCurrentUser(user);
          
          // 사용자 역할을 가져옴
          try {
            const docs = await fetchUserData(user.uid);
            setUserRole(docs ? docs.role : null);
          } catch (error) {
            console.error("Error fetching user role: ", error);
            setUserRole(null);
          }

          setAuthLoading(false);
        });

        return unsubscribe; 
      } catch (error) {
        console.error("Failed to set auth persistence: ", error);
      }
    };

    setAuthPersistence();
  }, []);

  const value: UserRoleType = userRole; 

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};
