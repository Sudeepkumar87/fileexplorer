"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileNode from "./FileNode";
import FileActions from "./FileActions";
import ErrorModal from "./ErrorModal";
import { setStructure, setSearchQuery, performSearch } from "@/redux/fileSlice";


import initialData from "./dataholder.json";

export default function FileExplorer() {
  const dispatch = useDispatch();
  const structure = useSelector((state) => state.files.structure);
  const searchQuery = useSelector((state) => state.files.searchQuery);
  const searchResults = useSelector((state) => state.files.searchResults);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
   
    dispatch(setStructure(initialData));
  }, [dispatch]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    dispatch(setSearchQuery(query));
    
    if (query.trim()) {
      setIsSearching(true);
      dispatch(performSearch(query));
    } else {
      setIsSearching(false);
      dispatch(setSearchQuery(""));
    }
  };

  if (!structure.name) return <p>Loading file structure...</p>;

  return (
    <div className="flex flex-col bg-gray-100 p-4 rounded-xl shadow w-full">
      <h2 className="text-lg font-bold mb-3">📁 File Explorer</h2>
      
  
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <FileActions />
      
      <div className="overflow-y-auto max-h-[60vh]">
        {isSearching ? (
          <div className="mt-2">
            <h3 className="font-semibold mb-2">Search Results:</h3>
            {searchResults.length > 0 ? (
              <div className="ml-2 space-y-1">
                {searchResults.map((result, index) => (
                  <div key={index} className="p-2 hover:bg-gray-200 rounded-md cursor-pointer">
                    {result.type === "folder" ? "📁" : "📄"} {result.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No results found</p>
            )}
          </div>
        ) : (
          <FileNode node={structure} path={[]} />
        )}
      </div>
      <ErrorModal />
    </div>
  );
}