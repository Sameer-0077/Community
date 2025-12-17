import { useState } from "react";
import { MessageCircle, Heart, SendHorizonal, Loader2 } from "lucide-react";
import { useEffect } from "react";
import ShowComments from "./ShowComments";
import ToastMsg from "./ToastMsg";
import useUserStore from "../store/userStore";

const PostCard = ({ post, edit = false, onDelete }) => {
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(); // total likes
  const [commented, setCommented] = useState(false);
  const [comments, setComments] = useState(); // total comments
  const [showAllComment, setShowAllComment] = useState();
  const [content, setCommentContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const user = useUserStore((state) => state.user);
  const toggleLike = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_TOGGLE_POST_LIKE_URI}/${post._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();
      if (!res.ok) {
        setToastMessage("Please login to like post");
        setShowMsg(true);
        return console.log("Error:", result.error);
      }
      if (result.liked) {
        setLikes(likes + 1);
      } else {
        setLikes(likes - 1);
      }

      setLike(result.liked);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const toggleComment = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_GET_COMMENTS_FOR_POST_URI}/${post._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const allComment = await res.json();

      // console.log(allComment);

      if (!res.ok) {
        throw new error(allComment.error);
      } else {
        // allComment.map((comm) =>
        //   console.log(`Comment: ${comm.content} Author: ${comm.author.name}`)
        // );
        setShowAllComment(allComment);
      }
      if (!user) {
        setToastMessage("Please login to view comment!");
        setShowMsg(true);
        return;
      }
      setCommented(!commented);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_DELETE_POST_URI}/${post._id}`,
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

  const getComments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_GET_ALL_COMMENT_URI}/${post._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const commentCount = await res.json();

      if (!res.ok) {
        throw new error(commentCount.error);
      } else {
        setComments(commentCount.totalComment);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const getLikes = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_GET_LIKE_ON_POST_URI}/${post._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const likes = await res.json();

      const isLike = await fetch(
        `${import.meta.env.VITE_API_TOGGLE_POST_LIKE_URI}/${post._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new error(likes.error);
      } else {
        setLikes(likes.totalLike);
        // console.log("Like:", likes.totalLike);
        // console.log("SetLike:", likes);
      }

      const result = await isLike.json();
      if (!isLike.ok) return console.log("Error:", result.error);
      setLike(result.liked);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  // const parentCommentId = null;

  const addComment = async () => {
    // console.log(content);
    try {
      setLoading(true);
      if (content.trim()) {
        const data = { content: content, parentCommentId: null };
        setCommentContent("");
        const res = await fetch(
          `${import.meta.env.VITE_API_ADD_NEW_COMMENT_URI}/${post._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
          }
        );

        const newComment = await res.json();
        // console.log(newComment);

        if (!res.ok) {
          throw new error(newComment.error);
        } else {
          console.log(newComment.message);
          getComments();
        }
      }
      setTimeout(() => {
        setCommented(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setToastMessage("Please login to comment!");
      setShowMsg(true);
      console.log("Error:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLikes();
    getComments();
  }, []);

  return (
    <div className="border bg-white rounded p-4 shadow-sm mb-4">
      <ToastMsg
        message={toastMessage}
        isVisible={showMsg}
        onClose={() => setShowMsg(false)}
      />
      <div className="text-md text-gray-700 text-left mb-4">
        <span className="font-bold">👤 {post.author.name}</span>
        <br />
      </div>
      {/* Text Content */}
      {post.text && (
        <p className="text-gray-800 px-2 whitespace-pre-wrap">{post.text}</p>
      )}

      {/* Media Content */}
      {post.media && post.media.length > 0 && (
        <div className="grid gap-2 mt-2">
          {post.media.map((item, index) => (
            <div key={index} className="rounded-xl overflow-hidden">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt="Post media"
                  className="w-full max-h-[450px] object-cover"
                  loading="lazy"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="w-full max-h-[450px] rounded-xl"
                />
              )}
            </div>
          ))}
        </div>
      )}
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
            like
              ? "bg-pink-100 text-pink-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="text-sm font-semibold">{likes}</span>
          <Heart
            size={20}
            fill={like ? "rgb(244 114 182)" : "none"} // tailwind pink-400
            className={like ? "text-pink-600" : "text-gray-600"}
          />
          <span>{like ? " Liked" : " Like"}</span>
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
      {commented && (
        <div className="mt-2 p-2 border bg-white rounded shadow-lg ">
          <div className="flex justify- items-center gap-2 p-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Comment your thought :)"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              className="text-blue-500 hover:text-blue-600"
              onClick={addComment}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Posting...
                </>
              ) : (
                <SendHorizonal size={28} />
              )}
            </button>
          </div>

          {showAllComment.map((comm) => (
            <ShowComments key={comm._id} comm={comm} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
