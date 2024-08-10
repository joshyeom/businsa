import { useState } from "react"
import { changeHandler } from "../utils/changeHandler"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
    const [ email, setEmail ] = useState<string>("")
    const [ password, setPassword ] = useState<string>("")

    
    const signinHandler = async (email:string, password:string) => {
        try{
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            console.log(user)
            alert("로그인 성공!")
        }catch(error){
            console.error(error)
            alert("로그인 실패")
        }
    }  


  return(
    <>
        <div>로그인하세요</div>
        <input type="text" placeholder="이메일 입력" value={email} name="email" onChange={(event) => changeHandler(event ,setEmail)}></input>
        <input type="password" placeholder="비밀번호 입력 5자리 이상" value={password} name="password" onChange={(event) => changeHandler(event ,setPassword)}></input>
        <button onClick={() => signinHandler(email, password)}>로그인</button>
    </>
)
}

export default Login