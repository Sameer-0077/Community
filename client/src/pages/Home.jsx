import { useState } from "react";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Just joined this awesome platform!",
      createdAt: new Date(),
      author: { name: "Sameer" },
    },
    {
      id: 2,
      content: "Second post by the dev 👨‍💻",
      createdAt: new Date(),
      author: { name: "Pushpa" },
    },
  ]);

  const handleNewPost = (content) => {
    const newPost = {
      id: Date.now(),
      content,
      createdAt: new Date(),
      author: { name: "You" },
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="mt-16">
      <CreatePost onPostSubmit={handleNewPost} />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
