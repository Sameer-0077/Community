import { useState } from "react";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { useEffect } from "react";
import LeftSidebar from "../components/LeftSideBar";
import RightSidebar from "../components/RightSide";
import { useRef } from "react";
import PostSkeleton from "../components/PostSkeleton";
import useUserStore from "../store/userStore";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const user = useUserStore((state) => state.user);
  const [error, setError] = useState(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  const isFirstLoad = useRef(true);
  const observerRef = useRef(null);

  const getFeedPosts = async () => {
    if (loading || !hasMore || error) return;
    try {
      setLoading(true);

      const query = new URLSearchParams({
        limit: 10,
        ...(cursor && { cursor: JSON.stringify(cursor) }),
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_GET_FEED_POST_URI}?${query.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load feed");
      }

      // console.log(data.posts);

      setPosts((prev) => {
        const map = new Map(prev.map((p) => [p._id, p]));
        data.posts.forEach((p) => map.set(p._id, p));
        return Array.from(map.values());
      });
      setCursor(data.nextCursor);
      // console.log("nextCursor:", data.nextCursor);

      setHasMore(Boolean(data.nextCursor));
      retryCountRef.current = 0; // ✅ reset on success
      setError(null);
    } catch (error) {
      retryCountRef.current += 1;
      console.error("Error loading feed:", error.message);
      if (retryCountRef.current >= MAX_RETRIES) {
        setError("Unable to load feed. Please try again later");
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // const getAllPost = async () => {
  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_API_GET_ALL_POST_URI}`, {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     // console.log("Response : ", res);

  //     const allPost = await res.json();
  //     if (!res.ok) {
  //       throw new Error("Error to getting all post");
  //     } else {
  //       // console.log("All post", allPost);
  //       setPosts(allPost);
  //     }
  //   } catch (error) {
  //     console.log("Error to getting all post:", error);
  //   }
  // };

  // const onRetry = () => {
  //   setHasMore(true);
  //   setLoading(false);
  //   setError(null);
  // };

  useEffect(() => {
    // getCurrentUser();
    // getAllPost();
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      getFeedPosts();
    }
  }, []);

  useEffect(() => {
    console.log("hasMore:", hasMore);
    console.log("loading:", loading);
    console.log("error:", error);

    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          getFeedPosts();
        }
      },
      { rootMargin: "200px" }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [cursor, hasMore, loading]);

  const handleNewPost = async (formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_CREATE_POST_URI}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      console.log(res);

      const newPost = await res.json();
      console.log(newPost);

      if (!res.ok) throw new Error(newPost.error);

      setPosts([newPost, ...posts]);
    } catch (error) {
      console.log("Error:", error);
    }

    // setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-1/4">
          <LeftSidebar />
        </aside>

        {/* Main Feed */}
        <main className="w-full md:w-2/4 space-y-6">
          {/* Create Post */}
          <CreatePost onPostSubmit={handleNewPost} />

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {/* Initial Skeleton */}
            {posts.length === 0 && loading && (
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            )}

            {/* Bottom Loader */}
            {loading && posts.length > 0 && (
              <div className="flex justify-center py-4">
                <span className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
            )}

            {/* Scroll Trigger */}
            <div ref={observerRef} className="h-6" />

            {/* End Message */}
            {!hasMore && posts.length > 0 && (
              <p className="text-center text-gray-500 py-4">
                🎉 You’ve reached the end
              </p>
            )}
            {error && (
              <div className="text-center py-6">
                <p className="text-red-500 text-lg font-semibold mb-2">
                  {error} or refresh the page
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden md:block w-1/4 space-y-6">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
};

export default Home;
