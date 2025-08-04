const AuthForm = ({ type, onSubmit, formData, onChange }) => {
  return (
    <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {type === "login" ? "Login" : "Register"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {type === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />
        {type === "register" && (
          <textarea
            name="bio"
            placeholder="Short bio"
            value={formData.bio}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {type === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
