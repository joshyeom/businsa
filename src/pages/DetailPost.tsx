import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useRouteHandler } from "../hooks/useRouteHandler";
import { useNavigate } from "react-router-dom";


interface UserDataType {
    id: string;
    email: string;
    description: string;
    imageUrls: string[];
    price: string;
    title: string;
    userId: string;
}
  
const DetailPost = () => {
  const { id } = useParams(); 
  const { currentUser } = useAuth();
  const [post, setPost] = useState<UserDataType | null>(null); 
  const [correctUser, setCorrectUser] = useState<boolean>(false)
  const route = useRouteHandler()
  const navigate = useNavigate()


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

  useEffect(() => {
    if(!currentUser || !post) return

    if(currentUser.uid == post.userId){
      setCorrectUser(true)
    }
  },[post])


  const deletePost = async (postId: string, uid: string) => {
    try {
        const postDocRef = doc(db, 'allPosts', postId);
        await deleteDoc(postDocRef);

        const userPostsRef = doc(db, "userPosts", uid);
        const docSnap = await getDoc(userPostsRef);
        const snapData = docSnap.data();

        if(!snapData){
          return
        }

        const snapDataPostsId = snapData.postsId || [];
        const filteredData = snapDataPostsId.filter((id: string) => id !== postId)
        await updateDoc(userPostsRef, {
          postsId: filteredData,
        });

        console.log(`Post with ID ${postId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting post:", error);
    }
};

  const deleteHandler = (postId: string, uid: string) => {
    const confirmed = confirm("삭제 하시겠습니까?")
    if(confirmed){
      deletePost(postId, uid)
      alert("삭제 성공")
      route('mypage')
    }
    else{
      return
    }
  }

  const editHandler = () => {
    navigate(`/create`, { state: { post } })
  }


  return (
    <div>
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <p>{post.price}</p>
          <div>
            {post.imageUrls.map((image, index) => (
              <img key={index} src={image} alt={`${index}`} />
            ))}
          </div>
          {correctUser && currentUser ? (
            <>
              <button onClick={() => deleteHandler(post.id, currentUser.uid)}>삭제</button>
              <button onClick={editHandler}>수정</button>
            </>
            ) :
            <button>구매</button>
          }
        </>
      ) : (
        <p>Loading...</p> // post가 null일 때 로딩 메시지 표시
      )}
    </div>
  );
};

export default DetailPost;
