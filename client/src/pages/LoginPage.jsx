/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import assets from "../assets/assets";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up"); // login or register
  const [fullName, setFullName] = useState(""); // full name state
  const [email, setEmail] = useState(""); // email state
  const [password, setPassword] = useState(""); // password state
  const [confirmPassword, setConfirmPassword] = useState(""); // confirm password state
  const [bio, setBio] = useState(""); // bio state
  const [isDataSubmitted, setIsDataSubmitted] = useState(false); // data submission state

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left section */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      {/* Right section */}
      <form className="flex flex-col gap-6 border-2 bg-white/8 text-white border-gray-500 p-6 rounded-lg shadow-lg ">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          <img src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 focus:outline-none rounded-md"
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

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              required
            />
          </>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
