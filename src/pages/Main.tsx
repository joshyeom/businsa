import { useRouteHandler } from "../hooks/useRouteHandler";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Main = () => {
  const route = useRouteHandler();
  const { currentUser } = useAuth();

  const signoutHandler = async () => {
    try{
        await signOut(auth)
        alert("로그아웃!")
    }catch(error){
        console.error(error)
    }
  }


  return (
    <>
      {!currentUser ? (
        <>
          <button onClick={() => route('signin')}>로그인</button>
          <button onClick={() => route('signup')}>회원가입</button>
        </>
      ) : (
        <>
            <div>환영합니다</div>
            <button onClick={signoutHandler}>로그아웃</button>
            <button onClick={() => route('mypage')}>마이페이지</button>
        </>
      )
    }
    </>
  );
}

export default Main;
