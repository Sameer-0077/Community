export default function RightSidebar() {
  return (
    <div className="space-y-6 sticky top-20">
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">
          Who to Follow 👥
        </h3>
        <ul className="mt-3 space-y-3">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40?img=5"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700">Jane Smith</span>
            </div>
            <button className="text-sm text-blue-600 hover:underline">
              Follow
            </button>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40?img=7"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700">John Doe</span>
            </div>
            <button className="text-sm text-blue-600 hover:underline">
              Follow
            </button>
          </li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Sponsored 📢</h3>
        <div className="mt-3 text-gray-500 text-sm">
          <p>Upgrade your skills with MERN Stack 🚀</p>
        </div>
      </div>
    </div>
  );
}
