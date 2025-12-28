function FeedError({ onRetry }) {
  return (
    <div className="text-center py-6">
      <p className="text-red-500 mb-2">Failed to load posts</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}

export default FeedError;
