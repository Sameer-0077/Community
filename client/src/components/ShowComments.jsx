import React, { useEffect, useState } from "react";
import { Heart, EllipsisVertical } from "lucide-react";
import useUserStore from "../store/userStore";

function ShowComments({ comm }) {
  const [countLike, setCountLike] = useState();
  const [isLike, setIsLiked] = useState();
  const user = useUserStore((state) => state.user);

  const getLike = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/post/all-likes-comment/${comm._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const allLike = await res.json();

      if (!res.ok) {
        throw new error(allLike.error);
      } else {
        console.log(allLike.totalLike);
        setCountLike(allLike.totalLike);
      }
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  const isCommentLike = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/post/like-comment/${comm._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const like = await res.json();
      if (!res.ok) {
        throw new error(like.error);
      } else {
        console.log(like.message);
        console.log(like.liked);
        setIsLiked(like.liked);
        getLike();
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    getLike();
    isCommentLike();
  }, []);

  return (
    <div>
      <p className="mt-1 p-2 flex text-sm border-t gap-2 justify-between items-center ">
        <span className="flex gap-2">
          <span className="font-semibold text-gray-800 text-nowrap">
            {comm.author.name}:
          </span>

          <span className="text-left">{comm.content}</span>
        </span>
        <span className="flex items-center gap-1">
          <button className="flex items-center gap-1" onClick={isCommentLike}>
            <Heart
              size={14}
              fill={isLike ? "rgb(244 114 182)" : "none"} // tailwind pink-400
              className={isLike ? "text-pink-600" : "text-gray-600"}
            />
            <span className="text-xs">{countLike}</span>
          </button>
          {/* {user._id === comm.author._id && (
            <span className="">
              <EllipsisVertical size={14} />
            </span>
          )} */}
        </span>
      </p>
    </div>
  );
}

export default ShowComments;
