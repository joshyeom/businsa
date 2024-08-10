import { useEffect, useState, useRef } from "react";
import { fetchUserData } from "../utils/fetchUserData";
import { useAuth } from "../contexts/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { changeHandler } from "../utils/changeHandler";

const Post = () => {
    const { currentUser } = useAuth();
    const [role, setRole] = useState<"seller" | "buyer" | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [prevImage, setPrevImage] = useState<string[]>([]);
    const imageRef = useRef<HTMLInputElement | null>(null);

    const uploadHandler = async () => {
        if (!currentUser || !imageRef.current?.files?.length) {
            return;
        }

        const files = Array.from(imageRef.current.files);
        const imageUrls: string[] = [];

        try {
            const uploadPromises = files.map(async (file) => {
                const storageRef = ref(storage, `images/${currentUser.uid}/${file.name}`);

                await uploadBytes(storageRef, file);

                return getDownloadURL(storageRef);
            });

            // 모든 업로드가 완료될 때까지 대기
            const urls = await Promise.all(uploadPromises);
            imageUrls.push(...urls);

            // Firestore에 게시글 추가
            await addDoc(collection(db, "posts"), {
                userId: currentUser.uid,
                title: title,
                description: description,
                price: price,
                imageUrls: imageUrls,
                createdAt: new Date(),
            });

            console.log("게시글 업로드 성공");
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = () => {
        if (imageRef.current?.files) {
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
                console.log(data);
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
                    <input type="text" placeholder="제목 작성" value={title} name="title" onChange={(event) => changeHandler(event, setTitle)} />
                    <input type="text" placeholder="설명 작성" value={description} name="description" onChange={(event) => changeHandler(event, setDescription)} />
                    <input type="number" placeholder="가격 작성" value={price} name="price" onChange={(event) => changeHandler(event, setPrice)} />
                    <input type="file" ref={imageRef} multiple onChange={handleImageChange} />
                    <button onClick={uploadHandler}>게시글 업로드</button>
                    {prevImage.length > 0 && (
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

export default Post;
