import { useEffect, useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "./ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { getDoc } from "firebase/firestore"
import { useRouteHandler } from "@/hooks/useRouteHandler"
import { Button } from "./ui/button"

interface cartsTypes{
    id: string;
    title: string;
    image: string;
    price: string;
}

export const CartSheet: React.FC = () => {
    const [carts, setCarts] = useState<cartsTypes[]>([])
    const { currentUser } = useAuth()
    const route = useRouteHandler()

    useEffect(() => {
        const fetchCarts = async () => {
            const storageItem = localStorage.getItem('cart');
            if (!storageItem) return;
    
            const carts = JSON.parse(storageItem);
            const allPostsRef = collection(db, "allPosts");
    
            const cartArray: cartsTypes[] = [];
    
            const cartPromises = carts.map(async (id: string) => {
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
    
            setCarts(cartArray);
        };
    
        fetchCarts();
    }, [currentUser]);
     

    return (
        <Sheet>
          <SheetTrigger className="text-lg font-medium">장바구니</SheetTrigger>
          <SheetContent className="flex flex-col justify-between">
            {carts.length > 0 ? (
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
            <section>
              <Button onClick={() => route('payment')}>전부 구매하기</Button>
            </section>
          </SheetContent>
        </Sheet>
      );
      
      
      
}