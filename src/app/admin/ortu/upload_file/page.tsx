"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

import { uploadAssessmentReport } from "@/lib/api/asesmentReport";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

export default function UploadFilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ⬇️ SESUAI handleOrtuRoute → ?id=jadwalId
  // ✅ BENAR
  const jadwalId = Number(searchParams.get("assessment_id"));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSubmitUpload = async () => {
    if (!selectedFile || !jadwalId) {
      handleApiError(null, "File atau data jadwal tidak valid");
      return;
    }

    try {
      setUploadLoading(true);
      await uploadAssessmentReport(jadwalId, selectedFile);
      showSuccessToast("File berhasil diupload");
      router.back();
    } catch (error) {
      console.error(error);
      handleApiError(error, "Gagal upload file");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">

        <main className="flex-1 flex justify-center items-center p-6">
          <AnimatePresence>
            <motion.div
              className="bg-white rounded-lg p-6 w-[420px] relative shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* CLOSE */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => router.back()}
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold mb-2">Upload File</h2>
              <p className="text-gray-600 text-sm mb-4">
                Tambahkan file atau dokumen Anda di sini
              </p>

              {/* Upload Area */}
              <div
                onClick={handleUploadAreaClick}
                className="border border-dashed rounded-lg py-10 text-center text-gray-500 cursor-pointer hover:bg-gray-50"
              >
                <p className="mb-1">Letakkan file Anda di sini</p>
                <p className="text-sm underline">atau klik untuk menelusuri</p>
                <p className="text-xs mt-3">File yang didukung: pdf</p>
                <p className="text-xs">Ukuran Maksimal : 10MB</p>

                {selectedFileName && (
                  <p className="mt-2 text-sm text-green-600">
                    File terpilih: {selectedFileName}
                  </p>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>

              <button
                disabled={uploadLoading}
                onClick={handleSubmitUpload}
                className="mt-6 w-full bg-[#81B7A9] text-white py-2 rounded-md"
              >
                {uploadLoading ? "Mengupload..." : "Lanjutkan"}
              </button>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
