import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main, Signin, Signup, CreatePost, MyPage, DetailPost } from "./pages";
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
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/detail/:id" element={<DetailPost />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App