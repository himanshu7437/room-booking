import { useState, useRef } from "react";
import { Upload } from "lucide-react";

export const FileInput = ({
  label = "",
  accept = "",
  multiple = false,
  onChange = () => {},
  error = "",
  ...props
}) => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const files = e.target.files;
    if (files?.length) {
      setFileName(multiple ? `${files.length} files selected` : files[0].name);
      onChange(e);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 transition-colors duration-200 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
        aria-label={`Upload ${label || "file"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
          {...props}
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">Click to upload</p>
          {fileName && <p className="text-xs text-primary-600">{fileName}</p>}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
