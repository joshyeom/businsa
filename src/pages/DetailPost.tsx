import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";

interface UserDataType {
    id: string;
    email: string;
    description: string;
    imageUrls: string[];
    price: string;
    title: string;
}
  
const DetailPost = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState<UserDataType | null>(null); 

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          // 단일 문서를 가져오기 위해 doc과 getDoc 사용
          const postRef = doc(db, "allPosts", id);
          const postSnap = await getDoc(postRef); // 문서 가져오기

          if (postSnap.exists()) {
            setPost(postSnap.data() as UserDataType); // 문서 데이터 설정
          }
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div>
      {post ? ( // post가 null이 아닐 때만 렌더링
        <>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <p>{post.price}</p>
          <div>
            {post.imageUrls.map((image, index) => (
              <img key={index} src={image} alt={`${index}`} />
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p> // post가 null일 때 로딩 메시지 표시
      )}
    </div>
  );
};

export default DetailPost;
