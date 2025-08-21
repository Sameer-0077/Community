import { NavLink } from "react-router-dom";
import useUserStore from "../store/userStore";

const Navbar = () => {
  const setUser = useUserStore((state) => state.setUser);
  const handleClick = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      const result = res.json();
      if (!res.ok) throw new Error(result.error);

      console.log(result.message);
      setUser(null);
      // navigate("/");
    } catch (error) {
      console.log("Error:", error.message);
    }
  };
  const user = useUserStore((state) => state.user);
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10 mb-16">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold text-blue-600">
          Community👥
        </NavLink>
        <div className="space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }
          >
            Home
          </NavLink>

          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }
            >
              Profile
            </NavLink>
          ) : (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }
            >
              👤{user.name}
            </NavLink>
          )}

          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }
            >
              Login
            </NavLink>
          ) : (
            <NavLink
              to="/"
              className="text-gray-700 hover:text-rose-600"
              onClick={handleClick}
            >
              Logout⏻
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
