import { useEffect, useState, useRef } from "react";
import { fetchUserData } from "../utils/fetchUserData";
import { useAuth } from "../contexts/AuthContext";
import { setDoc, doc, getDoc, collection, updateDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { changeHandler } from "../utils/changeHandler";
import { useRouteHandler } from "../hooks/useRouteHandler";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { categories } from "@/assets/categories";


const CreatePost = () => {
    const { currentUser } = useAuth();
    const [role, setRole] = useState<"seller" | "buyer" | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [prevImage, setPrevImage] = useState<string[]>([]);
    const [category, setCategory] = useState<string>("")
    const imageRef = useRef<HTMLInputElement | null>(null);
    const route = useRouteHandler();

    const uploadHandler = async () => {
        if (!currentUser || prevImage.length == 0) {
            alert("사진을 추가해주세요")
            return;
        }

        const files = imageRef.current?.files ? Array.from(imageRef.current.files) : [];
        const imageUrls: string[] = [];


        // Firestore에서 사용자 게시물 확인
        const sellerPostsRef = collection(db, "sellerPosts");
        const sellerDocRef = doc(sellerPostsRef, currentUser.uid);
        const docSnap = await getDoc(sellerDocRef);

        const allPostsRef = collection(db, "allPosts");
        const querySnapshot = await getDocs(allPostsRef);
        const newPostId = (querySnapshot.size + 1).toString();

        try {
            if(files.length > 0){
                const uploadPromises = files.map(async (file) => {
                    const storageRef = ref(storage, `images/${newPostId}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                });
                
                const urls = await Promise.all(uploadPromises);
                imageUrls.push(...urls);
            }
            

            await setDoc(doc(db, "allPosts", newPostId), {
                id: newPostId,
                userId: currentUser.uid,
                email: currentUser.email,
                title: title,
                description: description,
                price: price,
                imageUrls: imageUrls,
                createdAt: new Date(),
                category: category
            });
            
            if (docSnap.exists()) {
                const snapData = docSnap.data();
                const snapDataPostsId = snapData.postsId || [];
            
                const updatedPostsIds = [...snapDataPostsId, newPostId];
            
                await updateDoc(sellerDocRef, {
                    postsId: updatedPostsIds,
                });
            } else {
                const newArr = [newPostId]
                await setDoc(sellerDocRef, {
                    email: currentUser.email,
                    postsId: newArr,
                });
            }
        
            alert("게시글 업로드 성공");
            route('myposts');
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = () => {
        if(!imageRef.current?.files) return

        const files = Array.from(imageRef.current.files);
        const urls = files.map(file => URL.createObjectURL(file));
        setPrevImage((prev) => prev.concat(...urls));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) {
                return;
            }
            try {
                const data = await fetchUserData(currentUser.uid);
                if (!data) {
                    return;
                }
                setRole(data.role);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [currentUser]);


    return (
        <>
            {role === "seller" ? (
                    <>
                        <Input type="text" placeholder="제목 작성" value={title} name="title" onChange={(event) => changeHandler(event, setTitle)} />
                        <Textarea placeholder="설명 작성" value={description} name="description" onChange={(event) => changeHandler(event, setDescription)} />
                        <Input type="number" placeholder="가격 작성" value={price} name="price" onChange={(event) => changeHandler(event, setPrice)} />
                        <Input type="file" ref={imageRef} multiple onChange={handleImageChange} />
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{category ? categories[category] : '카테고리를 선택'}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>카테고리를 선택해주세요</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                            <DropdownMenuRadioItem value="Men's Clothing">남성 의류</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Women's Clothing">여성 의류</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Jewelery">주얼리</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Electronics">전자 제품</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                        </DropdownMenu>
                        <Button onClick={uploadHandler}>게시글 업로드</Button>
                        {prevImage.length >     0 && (
                            <div>
                                {prevImage.map((url, index) => (
                                    <img key={index} src={url} alt={url} style={{ width: '100px', height: 'auto', margin: '5px' }} />
                                ))}
                            </div>
                        )}
                    </>
            ) : (
                <div>잘못된 접근입니다.</div>
            )}
        </>
    );
};

export default CreatePost;