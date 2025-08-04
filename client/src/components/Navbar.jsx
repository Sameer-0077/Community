import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Community
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600">
            Profile
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
