import UserProfile from "../components/UserProfile";
import PostCard from "../components/PostCard";

const dummyUser = {
  name: "Sameer Yadav",
  email: "sameer@example.com",
  bio: "Full Stack Developer and lifelong learner.",
};

const dummyPosts = [
  {
    id: 1,
    content: "Excited to be part of this developer community!",
    createdAt: new Date(),
    author: { name: "Sameer Yadav" },
  },
  {
    id: 2,
    content: "Currently building a LinkedIn-like app!",
    createdAt: new Date(),
    author: { name: "Sameer Yadav" },
  },
];

const Profile = () => {
  return (
    <div className="space-y-6 min-h-screen ">
      <UserProfile user={dummyUser} />
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Posts</h3>
        <div className="space-y-4">
          {dummyPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
