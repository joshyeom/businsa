import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { getDoc } from "firebase/firestore"
import { useRouteHandler } from "@/hooks/useRouteHandler"
import { Button } from "../components/ui/button"
import { useQuery } from "@tanstack/react-query"

interface cartsTypes {
  id: string;
  title: string;
  image: string;
  price: string;
}

const fetchCartItems = async (cartIds: string[]): Promise<cartsTypes[]> => {
  const allPostsRef = collection(db, "allPosts");
  const cartArray: cartsTypes[] = [];

  const cartPromises = cartIds.map(async (id: string) => {
      try {
          const postRef = doc(allPostsRef, id);
          const postSnap = await getDoc(postRef);

          if (!postSnap.exists()) return;

          const data = postSnap.data();
          cartArray.push({
              id: data.id,
              title: data.title,
              image: data.imageUrls[0],
              price: data.price
          });
      } catch (error) {
          console.error(error);
      }
  });

  await Promise.all(cartPromises);

  return cartArray;
}

export const CartSheet = () => {
  const { currentUser } = useAuth();
  const route = useRouteHandler();

  const { data: carts = [], isLoading } = useQuery<cartsTypes[], Error>({
    queryKey: ['cartItems', currentUser?.uid],
    queryFn: async () => {
      const storageItem = localStorage.getItem('cart');
      if (!storageItem) return [];
  
      const cartIds = JSON.parse(storageItem);
      return fetchCartItems(cartIds);
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5,
  });

  return (
      <Sheet>
         <SheetTrigger className="relative inline-flex items-center text-white rounded-lg">
          <Button>장바구니</Button>
          {carts.length > 0 && (
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 text-xs font-semibold bg-red-500 text-white rounded-full flex items-center justify-center">
                  {carts.length}
              </div>
          )}
      </SheetTrigger>
        <SheetContent>
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">로딩 중...</div>
          ) : carts.length > 0 ? (
            carts.map((item) => (
              <div
                key={item.id}
                onClick={() => route(`detail/${item.id}`)}
                className="flex items-center p-2 mb-2 border border-gray-300 rounded-md bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md mr-2"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1 truncate w-full max-w-[200px]">{item.title}</div>
                  <div className="text-xs text-gray-600 truncate w-full max-w-[200px]">{item.price}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">장바구니가 없습니다</div>
          )}
        </SheetContent>
      </Sheet>
    );
}
