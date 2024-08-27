import { Header } from "@/components/header";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouteHandler } from "@/hooks/useRouteHandler";
import { useQuery } from "@tanstack/react-query";

interface UserDataType {
  id: string;
  email: string;
  description: string;
  imageUrls: string[];
  price: string;
  title: string;
  userId: string;
  category: string;
}

const fetchAllPosts = async (): Promise<UserDataType[]> => {
  const allPostsRef = collection(db, 'allPosts');
  const querySnapshot = await getDocs(allPostsRef);
  const posts = querySnapshot.docs.map(doc => doc.data() as UserDataType);

  return posts.reverse();
};

const Main = () => {
  const { data: allPosts = [], isLoading, error } = useQuery<UserDataType[], Error>({
    queryKey: ['allPosts'],
    queryFn: fetchAllPosts,
    staleTime: 1000 * 60 * 3 // 3분 캐싱
  });

  const route = useRouteHandler();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading posts</div>;

  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center pt-[60px]">
        <section className="w-4/5 max-w-[1100px] mx-auto flex flex-wrap gap-[20px]">
          {allPosts.length > 0 ? (
            allPosts.map((data) => (
              <Card className="w-full sm:basis-[calc(50%-20px)] md:basis-[calc(25%-20px)] flex-shrink-0" key={data.id}>
                <img
                  src={data.imageUrls[0]}
                  alt={data.title}
                  style={{ width: "100%", height: "200px", objectFit: "contain" }}
                  onClick={() => route(`detail/${data.id}`)}
                />
                <CardHeader>
                  <CardTitle>{data.title}</CardTitle>
                  <p>{data.price}$</p>
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
};

export default Main;
