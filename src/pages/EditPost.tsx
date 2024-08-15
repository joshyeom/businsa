import { useEffect, useState, useRef } from "react";
import { fetchUserData } from "../utils/fetchUserData";
import { useAuth } from "../contexts/AuthContext";
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import { changeHandler } from "../utils/changeHandler";
import { useRouteHandler } from "../hooks/useRouteHandler";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  

const EditPost = () => {
    const { currentUser } = useAuth();
    const location = useLocation();
    const { post } = location.state || {}
    const [role, setRole] = useState<"seller" | "buyer" | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [prevImage, setPrevImage] = useState<string[]>([]);
    const [category, setCategory] = useState<string>("")
    const [newCategory, setNewCategory] = useState<string>("")
    const imageRef = useRef<HTMLInputElement | null>(null);
    const route = useRouteHandler();



    useEffect(() => {
        if(post){
            setTitle(post.title)
            setDescription(post.description)
            setPrice(post.price)
            setPrevImage(post.imageUrls)
            setCategory(post.category)
        }
    },[])

    const uploadHandler = async () => {
        if (!currentUser || prevImage.length == 0) {
            alert("사진을 추가해주세요")
            return;
        }

        const files = imageRef.current?.files ? Array.from(imageRef.current.files) : [];
        const imageUrls: string[] = [];


        if(newCategory){
            const categoryPostsRef = collection(db, "categoryPosts");
            const categoryDocRef = doc(categoryPostsRef, currentUser.uid);
            const categoryDocSnap = await getDoc(categoryDocRef);


            if (categoryDocSnap.exists()) {
                const snapData = categoryDocSnap.data();
                const snapDataPostsId = snapData.postsId || [];
            
                const updatedPostsIds = [...snapDataPostsId, post.id];
            
                await updateDoc(categoryDocRef, {
                    postsId: updatedPostsIds,
                });
            } else {
                const newArr = [post.id]
                await setDoc(categoryDocRef, {
                    postsId: newArr,
                    category: category
                });
            }
        }

        try {
            if(files.length > 0){
                const uploadPromises = files.map(async (file) => {
                    const storageRef = ref(storage, `images/${post.id}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                });
                
                const urls = await Promise.all(uploadPromises);
                imageUrls.push(...urls);
            }

            const newImages = [...prevImage, ...imageUrls]
            await updateDoc(doc(db, "allPosts", post.id), {
                id: post.id,
                userId: currentUser.uid,
                email: currentUser.email,
                title: title,
                description: description,
                price: price,
                imageUrls: newImages,
                createdAt: new Date(),
            });
                alert("게시글 수정 성공");
                route(`detail/${post.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = () => {
        if(imageRef.current?.files && post && prevImage.length > 0 ){
            const confirmed = confirm('수정하면 이미지가 모두 삭제됩니다 삭제하시겠습니까?')
            if(!confirmed) return

            deletePost(post.id)

            setPrevImage([])
            const files = Array.from(imageRef.current.files);
            const urls = files.map(file => URL.createObjectURL(file));
            setPrevImage((prev) => prev.concat(...urls));
        }else if (imageRef.current?.files) {
            const files = Array.from(imageRef.current.files);
            const urls = files.map(file => URL.createObjectURL(file));
            setPrevImage((prev) => prev.concat(...urls));
        }
    };
    

    const deletePost = async (postId: string) => {
        try {
            if(!currentUser) return
    
            const folderRef = ref(storage, `images/${postId}`);
            const fileList = await listAll(folderRef);
            const deletePromises = fileList.items.map(fileRef => deleteObject(fileRef));
            await Promise.all(deletePromises);
    
        } catch (error) {
            console.error("Error deleting post:", error);
        }
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
                        <Button variant="outline">{category ? categories[category] : newCategory ? categories[newCategory] : '카테고리를 선택'}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>카테고리를 선택해주세요</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={newCategory} onValueChange={setNewCategory}>
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

export default EditPost;