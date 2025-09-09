import { NavLink } from "react-router-dom";
import { Users, Search, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import useUserStore from "../store/userStore";

const Navbar = () => {
  const user = useUserStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center space-x-2 text-xl font-bold text-blue-600"
        >
          <Users className="w-6 h-6" />
          <span>Community</span>
        </NavLink>

        {/* Search Bar (Desktop only) */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts or people..."
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Home
          </NavLink>

          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Login
            </NavLink>
          ) : (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              👤 {user.name}
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
    </nav>
  );
};

export default Navbar;
