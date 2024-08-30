import { lazy } from 'react';

export { default as Main } from './pages/Main';
export { default as Payment } from './pages/Payment';
export { default as Admin } from './pages/admin';
export const Signin = lazy(() => import('./pages/Signin'));
export const Signup = lazy(() => import('./pages/Signup'));
export const CreatePost = lazy(() => import('./pages/CreatePost'));
export const MyPosts = lazy(() => import('./pages/MyPosts'));
export const DetailPost = lazy(() => import('./pages/DetailPost'));
export const EditPost = lazy(() => import('./pages/EditPost'));
export const MyLike = lazy(() => import('./pages/MyLike'));
export const Category = lazy(() => import('./pages/Category'));
