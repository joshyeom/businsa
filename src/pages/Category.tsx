import { Header } from "@/components/header";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouteHandler } from "@/hooks/useRouteHandler";
import { useParams } from "react-router-dom";
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
  category: string;
}

const fetchAllData = async (id: string) => {
  const allPostsRef = collection(db, 'allPosts');
  const querySnapshot = await getDocs(allPostsRef);
  const posts = querySnapshot.docs.map(doc => doc.data() as UserDataType);
  const filtered = posts.filter((item) => item.category === id)
  return filtered
};

const Category = () => {
  const { id } = useParams<string>()
  const route = useRouteHandler()

  const { data: allPosts = [], isLoading, error} = useQuery<UserDataType[], Error>({
    queryKey: ['allPosts'],
    queryFn: () => fetchAllData(id || ''),
    staleTime: 1000 * 60 * 3 // 3분 캐싱
  })

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading posts</div>;

  return (
    <>
      <Header/>
      <section className="flex flex-col items-center justify-center pt-[60px]">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-10">{id ? categories[id] : null} 카테고리 검색 결과입니다</h2>
            
        </div>
        <section className="w-4/5 max-w-[1100px] mx-auto flex flex-wrap gap-[20px]">
          {allPosts && allPosts.length > 0 ? (
            allPosts.map((data) => (
              <Card className="w-full sm:basis-[calc(50%-20px)] md:basis-[calc(25%-20px)] flex-shrink-0" key={data.title}>
                <img
                  src={data.imageUrls[0]}
                  alt={data.imageUrls[0]}
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
}

export default Category;