const PostCard = ({ post, edit = false, onDelete }) => {
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
      <p className="text-gray-800 mb-2">{post.content}</p>
      <div className="text-sm text-gray-500">
        <span>By {post.author.name}</span> •{" "}
        <span>{new Date(post.createdAt).toLocaleString()}</span>
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
