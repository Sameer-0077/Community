import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Navbar from "./components/NavBar";
import Layout from "./Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useUserStore from "./store/userStore";

function App() {
  const setUser = useUserStore((state) => state.setUser);

  const getCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/current-user", {
        method: "GET",
        credentials: "include",
      });

      const user = await res.json();

      if (!res.ok) {
        // console.log("Error", user);
        throw new Error(user.error);
      } else {
        console.log("User:", user);
        setUser(user.user);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* <h2 className="p-2 bg-blue-500 text-3xl text-white">Community</h2> */}

      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
