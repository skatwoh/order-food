import React, { useState } from "react";

interface Props {
  onUpload?: (base64: string) => void;
}

const ImageUploader: React.FC<Props> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onUpload?.(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 max-w-xs rounded-md border border-gray-300"
        />
      )}
    </div>
  );
};

export default ImageUploader;
