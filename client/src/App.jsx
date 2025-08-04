import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar";
import Layout from "./Layout";

function App() {
  return (
    <div className="bg-gray-900 w-full min-h-screen">
      {/* <h2 className="p-2 bg-blue-500 text-3xl text-white">Community</h2> */}

      <Router>
        <Routes>
          <Route path="/" element={<Layout />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
