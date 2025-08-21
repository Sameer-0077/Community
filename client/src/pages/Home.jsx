import { useState } from "react";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { useEffect } from "react";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const getAllPost = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/post/all-post", {
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

  const handleNewPost = async (content) => {
    try {
      console.log(content);

      const res = await fetch("http://localhost:8000/api/post/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(content),
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
    <div className=" ">
      <CreatePost onPostSubmit={handleNewPost} />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
