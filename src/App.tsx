import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main, Signin, Signup } from "./pages";

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App