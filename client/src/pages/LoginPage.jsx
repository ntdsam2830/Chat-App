/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Log in"); // login or register
  const [fullName, setFullName] = useState(""); // full name state
  const [email, setEmail] = useState(""); // email state
  const [password, setPassword] = useState(""); // password state
  const [confirmPassword, setConfirmPassword] = useState(""); // confirm password state
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // toggle confirm password visibility
  const [bio, setBio] = useState(""); // bio state
  const [isDataSubmitted, setIsDataSubmitted] = useState(false); // data submission state
  const [passwordMismatch, setPasswordMismatch] = useState(false); // password mismatch state
  const [isTermsChecked, setIsTermsChecked] = useState(false); // agree terms checkbox

  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (currState === "Sign up" && confirmPassword.length > 0) {
      setPasswordMismatch(password !== confirmPassword);
    } else {
      setPasswordMismatch(false);
    }
  }, [currState, password, confirmPassword]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      if (passwordMismatch) {
        toast.error("Passwords do not match.");
        return;
      }

      if (!isTermsChecked) {
        toast.error("You must agree to the terms before signing up.");
        return;
      }

      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      confirmPassword,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left section */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      {/* Right section */}
      <form
        onSubmit={onSubmitHandler}
        className="w-96 max-w-lg flex flex-col gap-6 border-2 bg-white/8 text-white border-gray-500 p-8 rounded-lg shadow-lg"
      >
        {/* <h2 className="font-medium text-2xl flex justify-center items-center"> */}
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              required
            />

            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {currState === "Sign up" && !isDataSubmitted && (
              <>
                <div className="relative">
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white"
                  >
                    {showConfirmPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="text-sm text-red-400">
                    Passwords do not match.
                  </p>
                )}
              </>
            )}
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio... (optional)"
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:from-purple-200 hover:to-violet-900 transition-colors duration-200"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {currState === "Sign up" && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={isTermsChecked}
              onChange={(e) => setIsTermsChecked(e.target.checked)}
            />
            <p>Agree to the terms of use and privacy policy.</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                  setIsTermsChecked(false);
                }}
                className="font-medium text-violet-500 cursor-pointer hover:text-violet-700 transition-colors duration-200"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Sign up");
                  setIsDataSubmitted(false);
                  setIsTermsChecked(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
