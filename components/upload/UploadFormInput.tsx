"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { CloudUpload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ClientUploadedFileData } from "uploadthing/types";

interface UploadFormInputProps {
  beforeUpload: (files: File[]) => File[] | Promise<File[]>;
  handleSubmit: (response: ClientUploadedFileData<any>[]) => void;
}

function UploadFormInput({ beforeUpload, handleSubmit }: UploadFormInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="flex justify-center items-center">
      <UploadDropzone
        className="w-full max-w-md p-6 border-2 border-dashed border-rose-800 rounded-lg bg-gray-100 opacity-80 text-center flex flex-col items-center gap-4"
        endpoint="pdfUploader"
        onClientUploadComplete={(res) => {
          setFileName(null);
          toast.success("File uploaded successfully");
          handleSubmit(res);
        }}
        onUploadError={(error: Error) => {
          setFileName(null);
          toast.error(error.message);
        }}
        onUploadBegin={(name) => {
          // loading here
          toast.info(`Uploading...${name}`);
        }}
        onBeforeUploadBegin={beforeUpload}
        onDrop={(files) => {
          if (files?.length) {
            setFileName(files[0].name);
          }
        }}
        appearance={{
          container: {
            borderRadius: "12px",
            padding: "20px",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "transparent",
            cursor: "pointer",
            opacity: "1",
          },
          label: {
            fontSize: "16px",
            fontWeight: "bold",
            color: "#0F172A",
          },
          button: {
            backgroundColor: "#F4516C",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          },
        }}
        content={{
          label: fileName || "Choose file or drag and drop",
          uploadIcon: <CloudUpload size={30} color="#64748B" />,
          button: "Upload a file",
        }}
      />
    </div>
  );
}

export default UploadFormInput;
