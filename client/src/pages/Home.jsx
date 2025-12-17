import { useState } from "react";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { useEffect } from "react";
import LeftSidebar from "../components/LeftSideBar";
import RightSidebar from "../components/RightSide";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const getAllPost = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_GET_ALL_POST_URI}`, {
        method: "GET",
        credentials: "include",
      });

      // console.log("Response : ", res);

      const allPost = await res.json();
      if (!res.ok) {
        throw new Error("Error to getting all post");
      } else {
        // console.log("All post", allPost);
        setPosts(allPost);
      }
    } catch (error) {
      console.log("Error to getting all post:", error);
    }
  };

  useEffect(() => {
    // getCurrentUser();
    getAllPost();
  }, []);

  const handleNewPost = async (formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_CREATE_POST_URI}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      console.log(res);

      const newPost = await res.json();
      console.log(newPost);

      if (!res.ok) throw new Error(newPost.error);

      setPosts([newPost, ...posts]);
    } catch (error) {
      console.log("Error:", error);
    }

    // setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-1/4">
          <LeftSidebar />
        </aside>

        {/* Main Feed */}
        <main className="w-full md:w-2/4 space-y-6">
          {/* Create Post */}
          <CreatePost onPostSubmit={handleNewPost} />

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden md:block w-1/4 space-y-6">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
};

export default Home;
