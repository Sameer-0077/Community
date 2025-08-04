const UserProfile = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
      <p className="mt-2">{user.bio}</p>
    </div>
  );
};

export default UserProfile;
