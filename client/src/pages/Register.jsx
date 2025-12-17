import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Register submitted:", formData);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_SIGNUP_URI}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const user = await res.json();

      if (!res.ok) throw new Error(user.error);

      console.log("Signup successfull", user);
      return navigate("/login");
    } catch (error) {
      console.log("ERROR:", error.message);
    }

    // Call backend API here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-3xl mt-40"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          minLength={6}
          className="w-full p-3 mb-6 border rounded"
        />
        <textarea
          type="text"
          name="bio"
          placeholder="Write about yourself"
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
        >
          Create Account
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:underline cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
