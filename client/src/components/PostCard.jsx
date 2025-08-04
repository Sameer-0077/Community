const PostCard = ({ post }) => {
  return (
    <div className="border bg-white rounded p-4 shadow-sm mb-4">
      <p className="text-gray-800 mb-2">{post.content}</p>
      <div className="text-sm text-gray-500">
        <span>By {post.author.name}</span> •{" "}
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PostCard;
