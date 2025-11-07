"use client";
import { useSelector } from "react-redux";
import FileExplorer from "@/component/FileExplorer";

function FileViewer() {
  const selectedFile = useSelector((state) => state.files.selectedFile);
  return (
    <div className="p-4 bg-white shadow-md rounded-xl w-full">
      <h2 className="text-lg font-bold mb-2">📄 File Viewer</h2>
      {selectedFile ? (
        <p>Currently viewing: <strong>{selectedFile}</strong></p>
      ) : (
        <p>Select a file to view</p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 min-h-screen">
      <div className="w-full lg:w-1/2">
        <FileExplorer />
      </div>
      <div className="w-full lg:w-1/2">
        <FileViewer />
      </div>
    </main>
  );
}