import useRouteHandler from "../hooks/useRouteHandler"

const Main = () => {
    const route = useRouteHandler()
   

    return(
        <>
            <button onClick={() => route('signin')}>로그인</button>
            <button onClick={() => route('signup')}>회원가입</button>
        </>
    )
}

export default Main