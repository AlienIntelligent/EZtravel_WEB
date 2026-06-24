import { UploadCloud, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useCallback, useEffect } from "react";

export default function ImageUpload({
  currentImage,
  onUpload,
  uploadFn,
  className = "",
  label = "Kéo thả hoặc nhấn để tải ảnh lên",
  helpText = "Hỗ trợ PNG, JPG, JPEG, WEBP (Tối đa 5MB)",
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  useEffect(() => {
    console.log("currentImage changed:", currentImage);

    setPreview(currentImage || null);
  }, [currentImage]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    const objectUrl = URL.createObjectURL(file);

    console.log("objectUrl =", objectUrl);
    console.log("file =", file);

    setPreview(objectUrl);
    try {
      if (uploadFn) {
        // Run actual upload
        const resultUrl = await uploadFn(file);

        setPreview(resultUrl); // thêm dòng này

        setUploadSuccess(true);

        if (onUpload) {
          onUpload(file, resultUrl);
        }
      } else {
        // Fallback to Mock
        await new Promise((r) => setTimeout(r, 1500));
        setUploadSuccess(true);
        if (onUpload) {
          onUpload(file, objectUrl);
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
      // Optional: show error state
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (onUpload) {
      onUpload(null, null);
    }
  };

  console.log("preview =", preview);
  console.log("currentImage =", currentImage);

  return (
    <div className={`w-full ${className}`}>
      {preview ? (
        <div className="relative rounded-lg border border-border overflow-hidden bg-muted/30 group">
          <img
            src={preview}
            alt="Preview"
            onLoad={() => console.log("ẢNH LOAD THÀNH CÔNG")}
            onError={(e) => {
              console.log("ẢNH LỖI");
              console.log("src =", e.target.src);
            }}
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onButtonClick}
              disabled={isUploading}
            >
              <UploadCloud className="h-4 w-4 mr-2" /> Đổi ảnh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" /> Xóa
            </Button>
          </div>

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-2"></div>
              <p className="text-sm font-medium">Đang tải lên...</p>
            </div>
          )}

          {uploadSuccess && (
            <div className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4" /> Thành công
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
            ${dragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50"}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <div
            className={`p-4 rounded-full mb-4 ${dragActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
          >
            <ImageIcon className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">{label}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">{helpText}</p>

          <Button
            variant="outline"
            className="mt-6 z-10 relative pointer-events-none"
          >
            <UploadCloud className="h-4 w-4 mr-2" /> Chọn File
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
