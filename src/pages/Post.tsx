import { useEffect, useState} from "react"
import { fetchUserData } from "../utils/fetchUserData"
import { useAuth } from "../contexts/AuthContext";
const Post = () => {
    const { currentUser } = useAuth();
    const [ role, setRole ] = useState<"seller" | "buyer" | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) {
                return;
            }
            try {
                const data = await fetchUserData(currentUser.uid);
                if(!data){
                    return
                }
                console.log(data);
                setRole(data.role)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [currentUser]);
    
    return (
        <>
          {role === "seller" ? (
            <>
              <input type="text" placeholder="설명 작성"/>
            </>
          ) : (
            <div>잘못된 접근입니다.</div>
          )
        }
        </>
      );
}

export default Post