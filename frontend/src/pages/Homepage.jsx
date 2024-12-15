import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

function Homepage() {
  const [input, setInput] = useState({});
  const [toggleLogin, setToggleLogin] = useState(false);

  const navigate = useNavigate();
  let { userId } = useParams();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setInput((values) => ({ ...values, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let api = "http://localhost:8080/user/usercheck";
    axios
      .post(api, input)
      .then((res) => {
        // console.log(res.data.Data[0].role);
        // console.log(res.data.Data[0].email);
        userId = res.data.Data[0]._id;
        // console.log(userId);
        window.localStorage.setItem("name", res.data.Data[0].name);
        window.localStorage.setItem("email", res.data.Data[0].email);
        // message.success(res.data.msg);

        // navigate("/dashboard");
        if (res.data.Data[0].role === "Team-mate") {
          navigate(`/dashboard/${userId}`);
        }
        if (res.data.Data[0].role === "Admin") {
          navigate("/admin");
        }
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl text-purple-700 font-bold text-center mb-8">
          Task Management System
        </h1>

        {!toggleLogin ? (
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl text-purple-700 font-semibold mb-4">
              Login to Continue
            </h2>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                name="email"
                value={input.email}
                onChange={handleInput}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                name="password"
                value={input.password}
                onChange={handleInput}
                required
              />
            </div>
            <p className="text-sm text-right text-purple-600 underline mb-4 cursor-pointer">
              Forgot Password?
            </p>
            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Don&apos;t have an account?
              <button
                className="text-purple-600 underline"
                onClick={() => setToggleLogin(true)}
              >
                Sign Up
              </button>
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl text-purple-700 font-semibold mb-4">
              Sign Up to Use the App
            </h2>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm text-gray-600 mb-1"
              >
                Enter Username
              </label>
              <input
                type="text"
                placeholder="Harry Potter"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 mb-1"
              >
                Enter Email
              </label>
              <input
                type="email"
                placeholder="example@example.com"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm text-gray-600 mb-1"
              >
                Enter Password
              </label>
              <input
                type="password"
                placeholder="********"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition">
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <button
                className="text-purple-600 underline"
                onClick={() => setToggleLogin(false)}
              >
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
