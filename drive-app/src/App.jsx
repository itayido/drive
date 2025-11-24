import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/SignUp.jsx";

import ProtectedRoute from "./pages/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home/:username" element={<Home />}>
              {/* example to a route inside /home: */}
              {/* <Route path="info" element={<Info />} /> */}
            </Route>
          </Route>

          <Route path="*" element={<h1>EROR 404</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
