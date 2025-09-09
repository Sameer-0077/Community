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
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
      {/* Avatar */}
      <img
        src={user.avatar || "https://i.pravatar.cc/150?img=3"}
        alt={user.name}
        className="w-28 h-28 rounded-full border-4 border-blue-500 mb-4 object-cover"
      />

      {/* Name & Email */}
      <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
      <p className="text-sm text-gray-500">{user.email}</p>

      {/* Bio */}
      <p className="mt-3 text-gray-600 text-center">{user.bio}</p>

      {/* Stats */}
      {/* <div className="flex mt-4 gap-6 text-center">
        <div>
          <p className="font-semibold text-gray-800">{user.posts.length}</p>
          <p className="text-gray-500 text-sm">Posts</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{user.followers}</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{user.following}</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
      </div> */}

      {/* Logout Button */}
      <button
        onClick={handleClick}
        className="mt-5 px-6 py-2 rounded-full bg-rose-500 text-white font-semibold 
                   hover:bg-rose-600 shadow-md hover:shadow-lg transition-all duration-200"
      >
        Logout ⏻
      </button>
    </div>
  );
};

export default UserProfile;
