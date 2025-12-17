import { useState, useEffect } from "react";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { Loader2, Send, ImagePlus, X } from "lucide-react";
const CreatePost = ({ onPostSubmit }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  // handle media upload
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let imageCount = 0;
    let videoCount = 0;

    selectedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) imageCount++;
      if (file.type.startsWith("video/")) videoCount++;
    });

    // ❌ too many images
    if (imageCount > 4) {
      return setError("Maximum 4 images are allowed.");
    }

    // ❌ too many videos
    if (videoCount > 1) {
      return setError("Only 1 video is allowed.");
    }

    setError("");
    setFiles(selectedFiles); // FileList → Array

    // create previews
    const previewData = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setPreviews(previewData);
  };

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  // remove media
  const removeMedia = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!user) return navigate("/login");
    if (!text.trim() && files.length === 0) return;

    const formData = new FormData();
    if (text.trim()) formData.append("text", text);

    files.forEach((file) => {
      formData.append("media", file); // IMPORTANT: "media"
    });

    await onPostSubmit(formData);
    // console.log("Post posting");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setText("");
    setFiles([]);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="bg-white p-4 rounded-2xl shadow-md">
        {/* Top row */}
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="user"
            className="w-10 h-10 rounded-full"
          />

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 border rounded-full px-4 py-2"
          />

          <label className="cursor-pointer">
            <ImagePlus />
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Media Preview */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {previews.map((item, index) => (
              <div key={index} className="relative">
                {item.type.startsWith("image/") ? (
                  <img
                    src={item.url}
                    alt="preview"
                    className="rounded-lg object-cover h-40 w-full"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="rounded-lg h-40 w-full object-cover"
                    controls
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-8 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CreatePost;
