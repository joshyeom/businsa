import { db, storage } from "../firebase";
import { doc , getDoc, deleteDoc, updateDoc} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouteHandler } from "../hooks/useRouteHandler";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { deleteObject, listAll, ref } from "firebase/storage";



interface UserDataType {
  id: string;
  email: string;
  description: string;
  imageUrls: string[];
  price: string;
  title: string;
  userId: string;
}


const MyPosts = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserDataType[]>([]);
  const route = useRouteHandler()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
        if (currentUser) {
            try {
                // 'sellerPosts' 컬렉션에서 currentUser.uid 문서 가져오기
                const sellerPostsRef = doc(db, 'sellerPosts', currentUser.uid);
                const userDocSnap = await getDoc(sellerPostsRef);
                
                if (userDocSnap.exists()) {
                 
                    const userData = userDocSnap.data();
                    const postsIdArray = userData.postsId;

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



    const deletePost = async (postId: string, uid: string) => {
      try {
          const postDocRef = doc(db, 'allPosts', postId);
          await deleteDoc(postDocRef);

          const sellerPostsRef = doc(db, "sellerPosts", uid);
          const docSnap = await getDoc(sellerPostsRef);
          const snapData = docSnap.data();
          
          const folderRef = ref(storage, `images/${postId}`);
          const fileList = await listAll(folderRef);
          const deletePromises = fileList.items.map(fileRef => deleteObject(fileRef));
          await Promise.all(deletePromises);  


          if(!snapData){
            return
          }

          const snapDataPostsId = snapData.postsId || [];
          const filteredData = snapDataPostsId.filter((id: string) => id !== postId)
          await updateDoc(sellerPostsRef, {
            postsId: filteredData,
          });

      } catch (error) {
          console.error("Error deleting post:", error);
      }
    };

    const deleteHandler = (postId: string, uid: string, index: number) => {
      const confirmed = confirm("삭제 하시겠습니까?")
      if(confirmed){
        deletePost(postId, uid)
        setUserData((prev) => prev.filter((_, i) => i !== index))
        alert("삭제 성공")
      }
      else{
        return
      }
    }

    const editHandler = (post: UserDataType) => {
      navigate(`/edit`, { state: { post } })
    }



  return (
    <main>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 w-4/5 max-w-[1100px] mx-auto pt-[60px]">등록된 물품 정보</h2>
      <section className="flex justify-between w-4/5 max-w-[1100px] mx-auto pt-[30px]">
          <div className="w-1/2 flex flex-col items-start bg-white p-4 rounded-lg border border-black mb-2">
            <span className="text-lg font-semibold">소득</span>
            <span className="text-lg font-semibold">100,000원</span>
          </div>
          <div className="w-1/2 flex flex-col items-start bg-white p-4 rounded-lg border border-black mb-2">
            <span className="text-lg font-semibold">합계</span>
            <span className="text-lg font-semibold">50개</span>
          </div>
      </section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4  w-4/5 max-w-[1100px] mx-auto pt-[60px]">품목</h2>
      <section className="flex flex-col items-center justify-center pt-[60px]">
        <section className="w-4/5 max-w-[1100px] mx-auto flex flex-wrap gap-[20px]">
          {userData.length > 0 ? (
            userData.map((data, index) => (
              <Card className="w-full sm:basis-[calc(50%-20px)] md:basis-[calc(33.33%-20px)] flex-shrink-0" key={data.title}>
                <img src={data.imageUrls[0]} alt={data.imageUrls[0]} style={{ width: "100%",height: "200px" ,objectFit: "contain"}}  onClick={() => route(`detail/${data.id}`)}/>
                <CardHeader>
                  <CardTitle>{data.title}</CardTitle>
                  <p>{data.price}$</p>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Button onClick={() => editHandler(data)}>수정</Button>
                  <Button onClick={() => deleteHandler(data.id, data.userId, index)}>삭제</Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>등록된 게시글이 없습니다.</div>
          )}
        </section>
      </section>
    </main>
  );
};

export default MyPosts;