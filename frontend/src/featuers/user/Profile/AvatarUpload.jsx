// src/components/user/Profile/AvatarUpload.jsx
import React, { useRef } from "react";
import { Camera } from "lucide-react";

const AvatarUpload = ({ image, setImage, name }) => {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    setImage(URL.createObjectURL(file));
  };

  return (
    <div className="flex items-center gap-6 p-6 border rounded-xl bg-white">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
          {image ? (
            <img src={image} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            name?.charAt(0) || "U"
          )}
        </div>

        <button
          onClick={() => fileRef.current.click()}
          className="absolute bottom-0 right-0 bg-white border rounded-full p-2 shadow"
        >
          <Camera size={16} />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>

      <div>
        <p className="font-semibold">Profile Photo</p>
        <p className="text-sm text-gray-500">PNG, JPG (max 2MB)</p>
      </div>
    </div>
  );
};

export default AvatarUpload;