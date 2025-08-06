import { Link } from "react-router-dom";
import useUserStore from "../store/userStore";

const Navbar = () => {
  const user = useUserStore((state) => state.user);
  return (
    <nav className="bg-white shadow-md top-0 left-0 w-full z-10 mb-10">
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
          {!user ? (
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
          ) : (
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              {user.name}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
