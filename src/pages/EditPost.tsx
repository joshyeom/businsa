import { useEffect, useState, useRef, Suspense } from "react";
import { fetchUserData } from "../utils/fetchUserData";
import { useAuth } from "../contexts/AuthContext";
import { setDoc, doc, getDoc, collection, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { changeHandler } from "../utils/changeHandler";
import { useRouteHandler } from "../hooks/useRouteHandler";
import { v4 as uuid } from "uuid";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const EditPost = () => {
    const { currentUser } = useAuth();
    const location = useLocation();
    const { post } = location.state || {}
    const [role, setRole] = useState<"seller" | "buyer" | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [prevImage, setPrevImage] = useState<string[]>([]);
    const imageRef = useRef<HTMLInputElement | null>(null);
    const route = useRouteHandler();



    useEffect(() => {
        if(post){
            setTitle(post.title)
            setDescription(post.description)
            setPrice(post.price)
            setPrevImage(post.imageUrls)
        }
    },[])

    const uploadHandler = async () => {
        if (!currentUser || prevImage.length == 0) {
            alert("사진을 추가해주세요")
            return;
        }

        const files = imageRef.current?.files ? Array.from(imageRef.current.files) : [];
        const imageUrls: string[] = [];

        const newId = uuid()

        try {
            if(files.length > 0){
                const uploadPromises = files.map(async (file) => {
                    const storageRef = ref(storage, `images/${newId}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                });
                
                const urls = await Promise.all(uploadPromises);
                imageUrls.push(...urls);
            }


            // Firestore에서 사용자 게시물 확인
            const sellerPostsRef = collection(db, "sellerPosts");
            const userDocRef = doc(sellerPostsRef, currentUser.uid);
            const docSnap = await getDoc(userDocRef);

            if(post){
                const newImages = [...prevImage, ...imageUrls]
                await updateDoc(doc(db, "allPosts", post.id), {
                    id: newId,
                    userId: currentUser.uid,
                    email: currentUser.email,
                    title: title,
                    description: description,
                    price: price,
                    imageUrls: newImages,
                    createdAt: new Date(),
                });
                alert("게시글 업로드 성공");
                route('mypage');
                return
            }


            await setDoc(doc(db, "allPosts", newId), {
                id: newId,
                userId: currentUser.uid,
                email: currentUser.email,
                title: title,
                description: description,
                price: price,
                imageUrls: imageUrls,
                createdAt: new Date(),
            });

            

            if (docSnap.exists()) {
                const snapData = docSnap.data();
                const snapDataPostsId = snapData.postsId || [];
            
                const updatedPostsIds = [...snapDataPostsId, newId];
            
                await updateDoc(userDocRef, {
                    postsId: updatedPostsIds,
                });
            } else {
                const newArr = [newId]
                await setDoc(userDocRef, {
                    email: currentUser.email,
                    postsId: newArr,
                });
            }
            alert("게시글 업로드 성공");
            route('mypage');
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = () => {
    if(imageRef.current?.files && post ){
        const files = Array.from(imageRef.current.files);
        const urls = files.map(file => URL.createObjectURL(file));
        setPrevImage((prev) => prev.concat(...urls));
    }else if (imageRef.current?.files) {
            const files = Array.from(imageRef.current.files);
            const urls = files.map(file => URL.createObjectURL(file));
            setPrevImage(urls);
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
                <Suspense fallback={<Skeleton />}>
                    <>
                        <Input type="text" placeholder="제목 작성" value={title} name="title" onChange={(event) => changeHandler(event, setTitle)} />
                        <Textarea placeholder="설명 작성" value={description} name="description" onChange={(event) => changeHandler(event, setDescription)} />
                        <Input type="number" placeholder="가격 작성" value={price} name="price" onChange={(event) => changeHandler(event, setPrice)} />
                        <Input type="file" ref={imageRef} multiple onChange={handleImageChange} />
                        <Button onClick={uploadHandler}>게시글 업로드</Button>
                        {prevImage.length > 0 && (
                            <div>
                                {prevImage.map((url, index) => (
                                    <img key={index} src={url} alt={url} style={{ width: '100px', height: 'auto', margin: '5px' }} />
                                ))}
                            </div>
                        )}
                    </>
                </Suspense>
            ) : (
                <div>잘못된 접근입니다.</div>
            )}
        </>
    );
};

export default EditPost;