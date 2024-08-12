import { db } from "../firebase";
import { doc , getDoc} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouteHandler } from "../hooks/useRouteHandler";

interface UserDataType {
  id: string;
  email: string;
  description: string;
  imageUrls: string[];
  price: string;
  title: string;
}

const MyPage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserDataType[]>([]);
  const route = useRouteHandler()

  useEffect(() => {
    const fetchUserData = async () => {
        if (currentUser) {
            try {
                // 'userPosts' 컬렉션에서 currentUser.uid 문서 가져오기
                const userPostsRef = doc(db, 'userPosts', currentUser.uid);
                const userDocSnap = await getDoc(userPostsRef);
                
                if (userDocSnap.exists()) {
                 
                    const userData = userDocSnap.data();
                    const postsIdArray = userData.postsId; 
                    console.log(userData)

                    if (postsIdArray && postsIdArray.length > 0) {
                        const postFetches = postsIdArray.map(async (postId: string) => {
                            const postDocRef = doc(db, 'allPosts', postId);
                            const postDocSnap = await getDoc(postDocRef);
                            if (postDocSnap.exists()) {
                                return { ...postDocSnap.data(), id: postDocSnap.id };
                            } else {
                                return null;
                            }
                        });

                        const posts = await Promise.all(postFetches);
                        setUserData(posts);
                    } else {
                       alert("게시물 없음");
                    }
                } else {
                   alert("유저 정보 없음");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('잘못된 접근');
            route('/');
        }
    };
    fetchUserData();
  }, [currentUser]);

  return (
    <div>
      {userData.length > 0 ? (
        userData.map((data, index) => (
          <div key={index} onClick={() => route(`detail/${data.id}`)}>
            <span>{data.email}님의 페이지</span>
            <span>{data.title}</span>
            <p>{data.description}</p>
            <p>{data.price}</p>
            {/* <div> */}
              {/* {data.imageUrls.map((image, i) => ( 
               <img key={i} src={image} alt={`image-${i}`} />
             ))} */}
           {/* </div> */}
          </div>
        ))
      ) : (
        <div>등록된 게시글이 없습니다.</div>
      )}
    </div>
  );
};

export default MyPage;
