import { Button } from "./ui/button"
import { useRouteHandler } from "@/hooks/useRouteHandler"
import { useAuth } from "@/contexts/AuthContext"
import { signoutHandler } from "@/utils/signoutHandler"
import { fetchUserData } from "@/utils/fetchUserData"
import { useEffect, useState } from "react"
import { CartSheet } from "./cartSheet"

export const Header = () => {
    const route = useRouteHandler()
    const {currentUser} = useAuth()
    const [role, setRole] = useState<"seller" | "buyer" | null>(null)

    useEffect(() => {
        if(!currentUser) return
        const fetchRole = async () => {
            try{
                const data = await fetchUserData(currentUser.uid);

                if(!data) return
                setRole(data.role)
            }catch(error){
                console.error(error)
            }
        }
        fetchRole()
    },[currentUser])

    const mypageRouter = (role: "seller" | "buyer" | null) => {
        if(!role) return


        if(role === "seller"){
            route('myposts')
        }else{
            route('mycart')
        }
    }
    

    return(
        <header className="w-full h-auto bg-white border-b shadow-sm flex justify-end sticky top-0 z-50">
            {!currentUser ? (
                <div className="w-2/5  flex justify-end">
                    <Button onClick={() => route('signin')}>로그인</Button>
                    <Button onClick={() => route('signup')}>회원가입</Button>
                </div>
            ) : (
                <div className="w-2/5  flex justify-end">
                    {
                        role === "buyer" ? 
                            <CartSheet/>
                        : null
                    }
                    <Button onClick={signoutHandler}>로그아웃</Button>
                    <Button onClick={() => mypageRouter(role)}>마이 페이지</Button>
                    <Button onClick={() => route('create')}>게시글 생성</Button>
                </div>
                )
            }
        </header>
    )
}