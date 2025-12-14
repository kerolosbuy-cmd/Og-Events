/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';

interface ActionButtonsProps {
  isDarkMode: boolean;
  file: File | null;
  isUploading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function ActionButtons({ isDarkMode, file, isUploading, handleSubmit }: ActionButtonsProps) {

  return (
    <div className="flex gap-3 mt-6">
      <button
        type="submit"
        disabled={!file || isUploading}
        className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg disabled:shadow-none transform hover:scale-[1.02] disabled:scale-100`}
        onClick={handleSubmit}
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            Upload
          </>
        )}
      </button>
    </div>
  );
}