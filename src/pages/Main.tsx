import { useRouteHandler } from "../hooks/useRouteHandler";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "@/components/ui/button";

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
    <div>
      {!currentUser ? (
        <>
          <Button onClick={() => route('signin')}>로그인</Button>
          <Button onClick={() => route('signup')}>회원가입</Button>
        </>
      ) : (
        <>
            <div>환영합니다</div>
            <Button onClick={signoutHandler}>로그아웃</Button>
            <Button onClick={() => route('mypage')}>마이페이지</Button>
            <Button onClick={() => route('create')}>게시글 생성</Button>
        </>
        )
      }
    </div>
  );
}

export default Main;
