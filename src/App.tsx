import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main, Signin, Signup, CreatePost, MyPosts, DetailPost, EditPost, MyLike } from "./pages";
import { AuthProvider } from "./contexts/AuthContext";
import './index.css'


const App = () => {
  return(
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit" element={<EditPost />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/myLike" element={<MyLike />} />
          <Route path="/detail/:id" element={<DetailPost />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App