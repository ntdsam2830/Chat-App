/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/");
    // Handle form submission logic here (e.g., send data to the server)
    // You can access the selected image, name, and bio from the state variables
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          className="flex flex-col gap-5 p-10 flex-1"
          onSubmit={handleSubmit}
        >
          <h3 className="text-lg">Profile details</h3>
          <label
            className="flex items-center gap-3 cursor-pointer"
            htmlFor="avatar"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              className={`w-12 h-12 ${selectedImg && "rounded-full"}`}
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt=""
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write something about you"
            required
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
            onClick={() => navigate("/")}
            type="submit"
          >
            Save
          </button>
        </form>
        <img
          src={assets.logo_icon}
          alt=""
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
