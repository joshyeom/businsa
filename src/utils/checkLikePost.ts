import { db } from '@/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

export const checkLikePost = async (uid: string) => {
  if (!uid) return null;
  const buyerPostsRef = collection(db, 'buyerPosts');
  const buyerDocRef = doc(buyerPostsRef, uid);
  const docSnap = await getDoc(buyerDocRef);
  return { buyerDocRef, docSnap };
};
