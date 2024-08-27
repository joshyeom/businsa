import { db, storage } from "../firebase";
import { doc , getDoc, deleteDoc, updateDoc} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useRouteHandler } from "../hooks/useRouteHandler";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { deleteObject, listAll, ref } from "firebase/storage";
import { useQuery } from "@tanstack/react-query";



interface UserDataType {
  id: string;
  email: string;
  description: string;
  imageUrls: string[];
  price: string;
  title: string;
  userId: string;
}


const fetchUserData = async (uid: string) => {

  const buyerPostsRef = doc(db, 'buyerPosts', uid);
  const userDocSnap = await getDoc(buyerPostsRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    const likePostIdArray = userData?.likePostId;

    if (likePostIdArray && likePostIdArray.length > 0) {
      const postFetches = likePostIdArray.map(async (postId: string) => {
        const postDocRef = doc(db, 'allPosts', postId);
        const postDocSnap = await getDoc(postDocRef);
        if (postDocSnap.exists()) {
          return { ...postDocSnap.data(), id: postDocSnap.id };
        } else {
          return null;
        }
      });

      const posts = await Promise.all(postFetches);
      return posts.filter(post => post !== null); // null 값을 필터링하여 반환
    }
  }
  
  return [];
}


const MyLike = () => {
  const { currentUser } = useAuth();
  const route = useRouteHandler()

  if(!currentUser) return
  const { data: userData = [] , isLoading, error } = useQuery<UserDataType[], Error>({
    queryKey: ['like', `${currentUser.uid}`],
    queryFn: () => fetchUserData(currentUser.uid),
    staleTime: 1000 * 60
  })



    const deletePost = async (postId: string, uid: string) => {
      try {
          const postDocRef = doc(db, 'allPosts', postId);
          await deleteDoc(postDocRef);

          const buyerPostsRef = doc(db, "buyerPosts", uid);
          const docSnap = await getDoc(buyerPostsRef);
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
          await updateDoc(buyerPostsRef, {
            postsId: filteredData,
          });

      } catch (error) {
          console.error("Error deleting post:", error);
      }
    };

    const deleteHandler = (postId: string, uid: string, index: number) => {
      const confirmed = confirm("찜 목록에서 삭제 하시겠습니까?")
      if(confirmed){
        deletePost(postId, uid)
        userData.filter((_, i) => i !== index)
        alert("삭제 성공")
      }
      else{
        return
      }
    }

  return (
    <main>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 w-4/5 max-w-[1100px] mx-auto pt-[60px]">등록된 물품 정보</h2>
      <section className="flex justify-between w-4/5 max-w-[1100px] mx-auto pt-[30px]">
          <div className="w-1/2 flex flex-col items-start bg-white p-4 rounded-lg border border-black mb-2">
            <span className="text-lg font-semibold">총 합계</span>
            <span className="text-lg font-semibold">100,000원</span>
          </div>
          <div className="w-1/2 flex flex-col items-start bg-white p-4 rounded-lg border border-black mb-2">
            <span className="text-lg font-semibold">합계</span>
            <span className="text-lg font-semibold">50개</span>
          </div>
      </section>
      <section className="mb-4  w-4/5 max-w-[1100px] mx-auto pt-[60px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">품목</h2>
      <Button>모두 구매</Button>
      </section>
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

export default MyLike;