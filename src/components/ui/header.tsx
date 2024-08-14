import { Button } from "./button"
import { useRouteHandler } from "@/hooks/useRouteHandler"
import { useAuth } from "@/contexts/AuthContext"
import { signoutHandler } from "@/utils/signoutHandler"

export const Header = () => {
    const route = useRouteHandler()
    const {currentUser} = useAuth()

    

    return(
        <header className="w-full flex justify-end sticky top-0 z-50">
            {!currentUser ? (
                <div className="w-2/5  flex justify-end">
                    <Button onClick={() => route('signin')}>로그인</Button>
                    <Button onClick={() => route('signup')}>회원가입</Button>
                </div>
            ) : (
                <div className="w-2/5  flex justify-end">
                    <Button onClick={signoutHandler}>로그아웃</Button>
                    <Button onClick={() => route('mypage')}>마이페이지</Button>
                    <Button onClick={() => route('create')}>게시글 생성</Button>
                </div>
                )
            }
        </header>
    )
}