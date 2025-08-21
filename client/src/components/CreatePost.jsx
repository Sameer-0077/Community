import { useState } from "react";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
const CreatePost = ({ onPostSubmit }) => {
  const [content, setContent] = useState("");
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (content.trim()) {
      const data = { content: content };
      onPostSubmit(data);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 mt-10">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded mb-2 resize-none"
        placeholder="What's on your mind?"
        rows={3}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Post
      </button>
    </form>
  );
};

export default CreatePost;
