import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main, Signin, Signup, Post, MyPage } from "./pages";
import { AuthProvider } from "./contexts/AuthContext";


const App = () => {
  return(
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post" element={<Post />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App