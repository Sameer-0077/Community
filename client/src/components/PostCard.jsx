import { useState } from "react";
import { MessageCircle, Heart } from "lucide-react";

const PostCard = ({ post, edit = false, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(12); // starting likes
  const [commented, setCommented] = useState(false);
  const [comments, setComments] = useState(3); // starting comments

  const toggleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const toggleComment = () => {
    if (commented) {
      setComments(comments - 1);
    } else {
      setComments(comments + 1);
    }
    setCommented(!commented);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/post/user/${post._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok) return console.log("Error:", result.error);

      console.log(result.message);
      if (onDelete) onDelete(post._id);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <div className="border bg-white rounded p-4 shadow-sm mb-4">
      <div className="text-md text-gray-700 text-left mb-4">
        <span className="font-bold">👤 {post.author.name}</span>
        <br />
      </div>
      <p className="text-gray-800 mb-2 px-6">{post.content}</p>
      <div className="text-sm text-gray-700 text-left mb-2">
        {new Date(post.createdAt).toLocaleString()}
      </div>
      <hr />
      <div className="flex justify-around items-center mt-4 space-x-4">
        {/* Comment Button */}
        <button
          onClick={toggleComment}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium shadow-sm active:scale-95 transition
          ${
            commented
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="text-sm font-semibold">{comments}</span>
          <span> Comment</span>
          <MessageCircle
            size={20}
            className={commented ? "text-blue-600" : "text-gray-600"}
          />
        </button>

        {/* Like Button */}
        <button
          onClick={toggleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium shadow-sm transition
          ${
            liked
              ? "bg-pink-100 text-pink-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="text-sm font-semibold">{likes}</span>
          <Heart
            size={20}
            fill={liked ? "rgb(244 114 182)" : "none"} // tailwind pink-400
            className={liked ? "text-pink-600" : "text-gray-600"}
          />
          <span>{liked ? " Liked" : " Like"}</span>
        </button>
      </div>

      {edit && (
        <div className="mt-2 flex justify-end gap-4">
          {/* <button className="text-green-700 hover:underline"
          onClick={handleEdit}
          >Edit</button> */}
          <button
            className="text-red-700 hover:underline"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
