import { useState } from "react";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { Loader2, Send } from "lucide-react";
const CreatePost = ({ onPostSubmit }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!user) return navigate("/login");
    if (content.trim()) {
      const data = { content: content };
      onPostSubmit(data);
      setContent("");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow duration-200">
        <img
          src={user.avatar || "https://i.pravatar.cc/150?img=3"}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200">
          Post
        </button> */}
      </div>
      {/* <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded mb-2 resize-none"
        placeholder="What's on your mind?"
        rows={3}
      /> */}
      <button
        type="submit"
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-8 py-2 rounded-xl  mt-4 font-medium 
          shadow-md transition-all duration-200 
          ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95 text-white"
          }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Posting...
          </>
        ) : (
          <>
            <Send size={18} />
            Post
          </>
        )}
      </button>
    </form>
  );
};

export default CreatePost;
