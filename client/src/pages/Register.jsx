import { useState } from "react";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register submitted:", formData);
    // Call backend API here
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <AuthForm
        type="register"
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Register;
