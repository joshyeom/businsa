import { Button } from "./button"
import { useRouteHandler } from "@/hooks/useRouteHandler"
import { useAuth } from "@/contexts/AuthContext"
import { signoutHandler } from "@/utils/signoutHandler"
import { fetchUserData } from "@/utils/fetchUserData"
export const Header = () => {
    const route = useRouteHandler()
    const {currentUser} = useAuth()


    const mypageRouter = (uid: string) => {
        if(!currentUser) return
        const fetchRole = async () => {
            try{
                const data = await fetchUserData(uid);

                if(!data) return
                
                const role = data.role
                if(role === "seller"){
                    route('myposts')
                }else{
                    route('mycart')
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchRole()
    }
    

    return(
        <header className="w-full bg-white border-b shadow-sm flex justify-end sticky top-0 z-50">
            {!currentUser ? (
                <div className="w-2/5  flex justify-end">
                    <Button onClick={() => route('signin')}>로그인</Button>
                    <Button onClick={() => route('signup')}>회원가입</Button>
                </div>
            ) : (
                <div className="w-2/5  flex justify-end">
                    <Button onClick={signoutHandler}>로그아웃</Button>
                    <Button onClick={() => mypageRouter(currentUser.uid)}>마이 페이지</Button>
                    <Button onClick={() => route('create')}>게시글 생성</Button>
                </div>
                )
            }
        </header>
    )
}