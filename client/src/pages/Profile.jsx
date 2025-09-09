import UserProfile from "../components/UserProfile";
import PostCard from "../components/PostCard";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CreatePost from "../components/CreatePost";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  // console.log(user);

  const handleDeletePost = (deletedPostId) => {
    setPosts((prev) => prev.filter((post) => post._id !== deletedPostId));
  };

  const userPost = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/post/user/${user._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const allPost = await res.json();

      if (!res.ok) throw new Error(allPost.error);

      console.log("ALL post:", allPost);
      setPosts(allPost);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    if (!user) return navigate("/login");
    userPost();
  }, []);

  if (!user) return navigate("/login");
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Column → User Profile */}
        <div className="md:w-1/3">
          <UserProfile user={user} />
        </div>

        {/* Right Column → Posts */}
        <div className="md:w-2/3 flex flex-col gap-6">
          {/* Section Header */}

          {/* Optional: New Post Input */}

          <CreatePost />
          <h3 className="text-xl font-semibold mb-2 text-blue-500">
            My Posts 📰
          </h3>

          {/* User Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                edit={true}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
