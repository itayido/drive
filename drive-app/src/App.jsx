import "./css/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/register/register";
import AddInfo from "./pages/register/AddInfo";

import ProtectedRoute from "./ProtectedRoute";
import Info from "./pages/home/components/Info";
import Todo from "./pages/home/components/Todo";
import Posts from "./pages/home/components/Posts";
import PostDetails from "./pages/home/components/PostDetails";
import Albums from "./pages/home/components/Albums";
import AlbumDetails from "./pages/home/components/AlbumDetails";

function App() {
  return (
    <>
      <Home />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/additionalInfo" element={<AddInfo />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />}>
              <Route path="info" element={<Info />} />
              <Route path="todolist" element={<Todo />} />

              <Route path="posts" element={<Posts />} />
              <Route path="posts/post/:postId" element={<PostDetails />} />

              <Route path="albums" element={<Albums />} />
              <Route path="albums/album/:id" element={<AlbumDetails />} />
            </Route>
          </Route>

          <Route path="*" element={<h1>EROR 404</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
