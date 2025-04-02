// ImageUploader.jsx
import React, { useState } from "react";

export default function ImageUploader({ images, setImages }) {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block font-semibold mb-2">대표 이미지</label>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative border rounded overflow-hidden">
            <img
              src={img.preview}
              alt={`upload-${i}`}
              className="w-full h-32 object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <label className="cursor-pointer flex items-center justify-center border-dashed border-2 border-gray-300 rounded h-32 text-gray-400 hover:border-blue-400">
          +
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
