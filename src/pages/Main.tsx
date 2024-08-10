import { useRouteHandler } from "../hooks/useRouteHandler";
import { useAuth } from "../contexts/AuthContext";

const Main = () => {
  const route = useRouteHandler();
  const { userRole } = useAuth(); // AuthProvider로 감싸져 있어야 합니다.

  return (
    <>
      {!userRole ? (
        <>
          <button onClick={() => route('signin')}>로그인</button>
          <button onClick={() => route('signup')}>회원가입</button>
        </>
      ) : userRole === "buyer" ? (
        <div>환영합니다 구매자님</div>
      ) : (
        <div>환영합니다 판매자님</div>
      )}
    </>
  );
}

export default Main;
