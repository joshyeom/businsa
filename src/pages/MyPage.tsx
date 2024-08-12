import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore"; // 수정: getDocs, query, where 가져오기
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

interface UserDataType {
  userId: string;
  email: string;
  description: string;
  imageUrls: string[];
  price: string;
  title: string;
}

const MyPage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserDataType[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
            // 'posts' 컬렉션에서 userId가 currentUser.uid인 문서를 쿼리
        const q = query(collection(db, 'posts'), where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map(doc => ({ ...doc.data() })) as UserDataType[]; // 문서 데이터 변환
          setUserData(posts);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div>
      {userData.length > 0 ? (
        userData.map((data, index) => (
          <div key={index} style={{width: "100px", height: "100px"}}>
            <span>{data.email}님의 페이지</span>
            <span>{data.title}</span>
            <p>{data.description}</p>
            <p>{data.price}</p>
            <div>
              {data.imageUrls.map((image, i) => ( 
               <img key={i} src={image} alt={`image-${i}`} />
             ))}
           </div>
          </div>
        ))
      ) : (
        <div>등록된 게시글이 없습니다.</div>
      )}
    </div>
  );
};

export default MyPage;
