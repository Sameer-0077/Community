import UserProfile from "../components/UserProfile";
import PostCard from "../components/PostCard";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
    <div className="space-y-6 min-h-screen ">
      <UserProfile user={user} />
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-500">
          My posts 📰
        </h3>
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
  );
};

export default Profile;
