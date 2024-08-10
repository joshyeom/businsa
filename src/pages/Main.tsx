import { useRouteHandler } from "../hooks/useRouteHandler";
import { useAuth } from "../contexts/AuthContext";

const Main = () => {
  const route = useRouteHandler();
  const { currentUser } = useAuth(); // AuthProvider로 감싸져 있어야 합니다.
  console.log(currentUser)

  return (
    <>
      {!currentUser ? (
        <>
          <button onClick={() => route('signin')}>로그인</button>
          <button onClick={() => route('signup')}>회원가입</button>
        </>
      ) : (
        <div>환영합니다</div>
      )
    }
    </>
  );
}

export default Main;
