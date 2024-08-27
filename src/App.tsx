import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main, Signin, Signup, CreatePost, MyPosts, DetailPost, EditPost, MyLike, Category } from "./pages";
import { AuthProvider } from "./contexts/AuthContext";
import './index.css'
import { Helmet } from 'react-helmet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Helmet>
            <meta charSet="utf-8" />
            <title>Businsa</title>
            <meta name="description" content="Welcome to Businsa" />
          </Helmet>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit" element={<EditPost />} />
            <Route path="/myposts" element={<MyPosts />} />
            <Route path="/myLike" element={<MyLike />} />
            <Route path="/detail/:id" element={<DetailPost />} />
            <Route path="/:id" element={<Category />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App