import { Header } from "@/components/ui/header";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouteHandler } from "@/hooks/useRouteHandler";

interface UserDataType {
  id: string;
  email: string;
  description: string;
  imageUrls: string[];
  price: string;
  title: string;
  userId: string;
}

const Main = () => {
  const [allPosts, setAllPosts] = useState<UserDataType[] | null>(null)
  const route = useRouteHandler()

  useEffect(() => {
    const fetchAllData = async () => {
      try {
          // 'sellerPosts' 컬렉션에서 currentUser.uid 문서 가져오기
          const allPostsRef = collection(db, 'allPosts');
          const querySnapshot = await getDocs(allPostsRef)
          
          const posts = querySnapshot.docs.map(doc => ({
            ...doc.data(),
          })) as UserDataType[];

          setAllPosts(posts.reverse());
      } catch (error) {
          console.error(error);
      }
    };
    fetchAllData();
  }, []);

  return (
    <>
      <Header/>
      <section className="flex flex-col items-center justify-center pt-[60px]">
        <section className="w-4/5 max-w-[1100px] mx-auto flex flex-wrap gap-[20px]">
          {allPosts && allPosts.length > 0 ? (
            allPosts.map((data) => (
              <Card className="w-full sm:basis-[calc(50%-20px)] md:basis-[calc(33.33%-20px)] flex-shrink-0" key={data.title}>
                <img
                  src={data.imageUrls[0]}
                  alt={data.imageUrls[0]}
                  style={{ width: "100%", height: "200px", objectFit: "contain" }}
                  onClick={() => route(`detail/${data.id}`)}
                />
                <CardHeader>
                  <CardTitle>{data.title}</CardTitle>
                  <p>{data.price}원</p>
                </CardHeader>
              </Card>
            ))
          ) : (
            <div>등록된 게시글이 없습니다.</div>
          )}
        </section>
      </section>
    </>
  );
}

export default Main;
