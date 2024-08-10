import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchUserData = async (uid: string) => {
  const userDoc = doc(db, 'users', uid);
  const userSnap = await getDoc(userDoc);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return null;
  }
};