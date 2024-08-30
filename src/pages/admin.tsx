import { useEffect } from "react";
import { setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { convertToWebP } from "@/services/convertToWebp";
import { useAuth } from "@/contexts/AuthContext";

interface jsonDataTypes {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  }

const CreatePost = () => {
    const { currentUser } = useAuth() 

  const uploadData = async () => {
    if(!currentUser) return
    try {
      const allPostsRef = collection(db, "allPosts");
      const querySnapshot = await getDocs(allPostsRef);
    
      let querySnapShotLength = querySnapshot.size

    
      const jsonData = await fetch('https://fakestoreapi.com/products').then(res=>res.json()) as jsonDataTypes[]

      for (const item of jsonData) {
        querySnapShotLength += 1
        const newPostId = querySnapShotLength.toString().padStart(5, '0');

        // Upload image to Firebase Storage
        const imageRef = ref(storage, `images/${newPostId}/${item.id}.jpg`);
        const imageBlob = await fetch(item.image).then(res => res.blob()) as File;
        const webP = await convertToWebP(imageBlob) as Blob
        await uploadBytes(imageRef, webP);

        const imageUrl = await getDownloadURL(imageRef);

        // Save data to Firestore
        await setDoc(doc(db, "allPosts", newPostId), {
          id: newPostId,
          userId: currentUser.uid,
          email: currentUser.email,
          title: item.title,
          description: item.description,
          price: item.price,
          imageUrls: [imageUrl],
          createdAt: new Date(),
          category: item.category,
          amount: item.rating.count
        });
      }

      alert("Data uploaded successfully");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  useEffect(() => {
    uploadData();
  }, []);

  return <div>Uploading data...</div>;
};

export default CreatePost;
