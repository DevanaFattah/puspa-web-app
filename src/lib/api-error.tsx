import React from "react";
import toast from "react-hot-toast";

/**
 * Parsing error dari API dan menampilkannya menggunakan react-hot-toast.
 * Mendukung format error validasi bersarang (nested validation errors).
 */
export function handleApiError(error: any, defaultMessage = "Terjadi kesalahan") {
  let mainMessage = defaultMessage;
  let validationErrors: string[] = [];

  if (error?.response?.data) {
    const data = error.response.data;
    
    // Gunakan pesan error dari API jika ada
    if (data.message) {
      mainMessage = data.message;
    }
    
    // Jika ada nested errors (errors: { field: [msg1, msg2] })
    if (data.errors && typeof data.errors === "object") {
      Object.keys(data.errors).forEach((key) => {
        const fieldErrors = data.errors[key];
        if (Array.isArray(fieldErrors)) {
          validationErrors.push(...fieldErrors);
        } else if (typeof fieldErrors === "string") {
          validationErrors.push(fieldErrors);
        }
      });
    }
  } else if (error?.message) {
    mainMessage = error.message;
  }

  // Tampilkan Toast error yang cantik
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "toast-slide-in" : "toast-slide-out"
        } max-w-sm w-full bg-white border border-red-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] pointer-events-auto flex items-center justify-between p-3.5 relative`}
      >
        {/* Left icon & text */}
        <div className="flex gap-2.5 items-center flex-1 pr-4">
          <div className="bg-rose-50 text-rose-600 rounded-lg p-1.5 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              ></path>
            </svg>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-gray-800 leading-snug">{mainMessage}</span>
            {validationErrors.length > 0 && (
              <ul className="list-disc pl-3 text-[10px] text-rose-700/80 space-y-0.5 mt-1 font-medium">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="leading-snug">{err}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1 rounded-lg transition-colors cursor-pointer shrink-0 focus:outline-none"
        >
          <svg
            className="w-3.5 h-3.5 stroke-[2.5]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    ),
    {
      duration: 10000,
      id: "api-error-toast",
    }
  );

  return mainMessage;
}

/**
 * Menampilkan toast sukses secara global
 */
export function showSuccessToast(message: string) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "toast-slide-in" : "toast-slide-out"
        } max-w-sm w-full bg-white border border-emerald-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] pointer-events-auto flex items-center justify-between p-3.5 relative`}
      >
        {/* Left icon & text */}
        <div className="flex gap-2.5 items-center flex-1 pr-4">
          <div className="bg-emerald-50 text-emerald-600 rounded-lg p-1.5 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              ></path>
            </svg>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-gray-800 leading-snug">{message}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1 rounded-lg transition-colors cursor-pointer shrink-0 focus:outline-none"
        >
          <svg
            className="w-3.5 h-3.5 stroke-[2.5]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    ),
    {
      duration: 5000,
    }
  );
}
