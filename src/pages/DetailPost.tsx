import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useRouteHandler } from "../hooks/useRouteHandler";
import { useNavigate } from "react-router-dom";
import { deleteObject, listAll, ref } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { checkLikePost } from "@/utils/checkLikePost";
import { categories } from "@/assets/categories";
import { useQuery } from "@tanstack/react-query";

interface UserDataType {
    id: string;
    email: string;
    description: string;
    imageUrls: string[];
    price: string;
    title: string;
    userId: string;
    amount: string;
    category: string;
}
  
const fetchPost = async (id: string) => {
    const postRef = doc(db, "allPosts", id);
    const postSnap = await getDoc(postRef); 
    return postSnap.data() as UserDataType
}


const DetailPost = () => {
  const { id } = useParams(); 
  const { currentUser } = useAuth();
  const [correctUser, setCorrectUser] = useState<boolean>(false)
  const [isLike, setIsLike] = useState<boolean>(false)
  const [isCart, setIsCart] = useState<boolean>(false)
  const route = useRouteHandler()
  const navigate = useNavigate()

  const { data: post, isLoading, error } = useQuery<UserDataType | null, Error>({
    queryKey: ['detailPost', id],
    queryFn: () => fetchPost(id || ''),
    staleTime: 1000 * 60 * 3 // 3분 캐싱
  })
  
  if (isLoading) {
    console.log("Loading...");
  }
  
  if (error) {
    console.error("Error:", error);
  }

  useEffect(() => {
    if(!currentUser || !post) return

    const savedCart = localStorage.getItem("cart");
    if(!savedCart) return

    const cartItems = JSON.parse(savedCart) as string[];
    const filtered = cartItems.findIndex(item => item === post.id);

    if (filtered !== -1) setIsCart(true);

    if(currentUser.uid == post.userId){
      setCorrectUser(true)
    }else{
      const fetchLikeStatus = async () => {
        try {
          const res = await checkLikePost(currentUser.uid);
          
          if (!res) return;
          
          const { docSnap } = res;
  
          if (docSnap && docSnap.exists()) {
            const snapData = docSnap.data();
            const snapDataPostsId = snapData.likePostId || [];
            
            const isLike = snapDataPostsId.findIndex((id: string) => id === post.id);
            
            if (isLike !== -1) {
              setIsLike(true);
            }
          }
      }catch(error){
        console.error(error)
      }
    }
    fetchLikeStatus()
  }
  },[post])

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
      route('myposts')
    }
    else{
      return
    }
  }

  const editHandler = () => {
    navigate(`/edit `, { state: { post } })
  }

  const likeHandler = (postId: string) => {
    addLike(postId, isLike)
    alert("찜 완료")
  }

  const addLike = async (postId: string, isLike: boolean) => {
    if(!currentUser) return
    try{
      const res = await checkLikePost(currentUser.uid);
      
      if (!res) return;
      
      const { buyerDocRef, docSnap } = res;
      
      if (docSnap && docSnap.exists()) {
        const snapData = docSnap.data();
        const snapDataPostsId = snapData.postsId || [];
        
        if(!isLike){
          const updatedPostsIds = [...snapDataPostsId, postId];
          
          await updateDoc(buyerDocRef, {
            likePostId: updatedPostsIds,
          });
          setIsLike(true)
        }else{
          const updatedPostsIds = snapDataPostsId.filter((id: string) => id !== postId)

          await updateDoc(buyerDocRef, {
            likePostId: updatedPostsIds,
          });
          setIsLike(false)
        }
    } else {
      const newArr = [postId]
      await setDoc(buyerDocRef, {
          likePostId: newArr,
        });
      }
    }catch(error){
      console.error(error)
    }
  }

  const cartHandler = (id: string, isCart: boolean) => {
    const cart = localStorage.getItem("cart");
    const cartItems = cart ? JSON.parse(cart) : [];
    if(!isCart){
      cartItems.push(id);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      setIsCart(true)
    }else{
      const filtered = cartItems.filter((item: string) => item !== id)
      localStorage.setItem("cart", JSON.stringify(filtered));
      setIsCart(false)
    }
  }

  return (
    <main className="flex justify-between items-center w-4/5 mx-auto h-screen pt-[30px] ">
      {post ? (
        <section className="w-full flex justify-between">
          <section className="w-1/2 flex items-center">
            <aside className="flex items-center flex-col items-center">
              {post.imageUrls.map((image, index) => (
                <img key={index} src={image} alt={`${index}`} style={{ width: "100px", height: "100px" ,objectFit: "contain"}} />
              ))}
            </aside>
                <img key={post.imageUrls[0]} src={post.imageUrls[0]} alt={post.imageUrls[0]} style={{ width: "500px", height: "500px" ,objectFit: "contain"}} />
          </section>
          <section className="w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {post.title}
              </h2>
              <h3 className="text-md font-semibold text-gray-700 mb-4">
                {post.email}
              </h3>
              <Button onClick={() => route(`${post.category}`)}>
                {categories[post.category]}
              </Button>
            </div>
            <div>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <p className="text-lg font-bold text-gray-800 mb-4">
                {post.price}원
              </p>
              <p className="text-lg font-bold text-gray-800 mb-4">
                {post.amount}개 남음
              </p>
            </div>
            {correctUser && currentUser ? (
              <div className="flex flex-col gap-[6px]">
                <Button onClick={() => editHandler()}>수정하기</Button>
                <Button onClick={() => deleteHandler(post.id, post.userId)}>삭제하기</Button>
              </div>
              ) :
              <div className="flex flex-col gap-[6px]">
                {
                  currentUser ? 
                  <>
                    <Button onClick={() => likeHandler(post.id)}>{isLike ? "찜 해제" : "찜 하기"}</Button>
                    <Button onClick={() => cartHandler(post.id, isCart)}>{isCart ? "장바구니 해제" : "장바구니 담기"}</Button>
                  </>
                  : null
                }
                <Button>구매하기</Button>
              </div>
            }
          </section>
        </section>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
};

export default DetailPost;
