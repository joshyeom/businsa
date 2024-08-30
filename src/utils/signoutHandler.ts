import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';

export const signoutHandler = async () => {
  try {
    await signOut(auth);
    alert('로그아웃!');
  } catch (error) {
    console.error(error);
  }
};
