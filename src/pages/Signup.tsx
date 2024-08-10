import { useState } from "react"
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { changeHandler } from "../utils/changeHandler"
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [ email, setEmail ] = useState<string>("")
  const [ password, setPassword ] = useState<string>("")
  const [ role, setRole] = useState<string>("seller")


  const signupHanlder = async (email: string, password: string, role: string) => {
    const emailPattern =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailPattern.test(email)){
      alert('잘못된 이메일 형식')
      return
    }

    if(password.length < 6){
      alert('비밀번호 6자리 이상')
      return
    }
    
    try{
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, "users", user.uid), {
          email: email,
          role: role
        });
        alert('회원가입 완료');
    }catch(error){
      console.error("Firestore 요청 오류:", error);
    }
  }
  
    
  return(
      <>
        <div>회원가입</div>
        <input type="text" placeholder="이메일 입력" value={email} name="email" onChange={(event) => changeHandler(event ,setEmail)}></input>
        <input type="password" placeholder="비밀번호 입력 5자리 이상" value={password} name="password" onChange={(event) => changeHandler(event ,setPassword)}></input>
          <label>
          <input type="radio" name="role" value="seller" onClick={(event) => changeHandler(event, setRole)}/>
          판매자
        </label>
        <label>
          <input type="radio" name="role" value="buyer" onClick={(event) => changeHandler(event, setRole)}/>
          구매자
        </label>
        <button onClick={() => signupHanlder(email, password, role)}>회원가입</button>
      </>
  )
}

export default Signup