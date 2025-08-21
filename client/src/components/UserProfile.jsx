import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
const UserProfile = ({ user }) => {
  // const navigate = useNavigate();
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
  return (
    <div className="bg-white p-6 rounded shadow-md flex flex-col justify-center">
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
      <p className="mt-2">{user.bio}</p>
      <button
        className="self-end text-rose-500 inline-block hover:text-rose-700"
        onClick={handleClick}
      >
        Logout⏻
      </button>
    </div>
  );
};

export default UserProfile;
