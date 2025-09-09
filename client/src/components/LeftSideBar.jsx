export default function LeftSidebar() {
  return (
    <div className="space-y-6 sticky top-20">
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Trending 🔥</h3>
        <ul className="mt-3 space-y-2 text-gray-600">
          <li className="hover:text-blue-600 cursor-pointer">#React</li>
          <li className="hover:text-blue-600 cursor-pointer">#JavaScript</li>
          <li className="hover:text-blue-600 cursor-pointer">#WebDev</li>
          <li className="hover:text-blue-600 cursor-pointer">#MERN</li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Shortcuts ⚡</h3>
        <ul className="mt-3 space-y-2 text-gray-600">
          <li className="hover:text-blue-600 cursor-pointer">My Profile</li>
          <li className="hover:text-blue-600 cursor-pointer">Saved Posts</li>
          <li className="hover:text-blue-600 cursor-pointer">Settings</li>
        </ul>
      </div>
    </div>
  );
}
