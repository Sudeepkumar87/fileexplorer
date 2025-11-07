"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createItem, renameItem, deleteItem } from "@/redux/fileSlice";
import { toast } from 'react-toastify';
import DeleteModal from "./DeleteModal";

export default function FileActions() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("create"); // "create", "rename", or "delete"

  // Create state
  const [createPath, setCreatePath] = useState("");
  const [createName, setCreateName] = useState("");
  const [createType, setCreateType] = useState("file");

  // Rename state
  const [renamePath, setRenamePath] = useState("");
  const [renameOldName, setRenameOldName] = useState("");
  const [renameNewName, setRenameNewName] = useState("");

  // Delete state
  const [deletePath, setDeletePath] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCreate = () => {
    // Validation
    if (!createName.trim()) {
      toast.error("Please enter a name for the new item");
      return;
    }
    
    if (createName.includes("/")) {
      toast.error("File/folder name cannot contain '/' character");
      return;
    }
    
    // For root level, path should be empty array
    // For nested paths, we split by '/' and filter out empty strings
    const pathArray = createPath ? createPath.split("/").filter(p => p.trim()) : [];
    
    // Dispatch action and let Redux handle the operation
    const result = dispatch(createItem({ path: pathArray, name: createName, type: createType }));
    
    // Clear form
    setCreateName("");
    toast.success(`"${createName}" created successfully`);
  };

  const handleRename = () => {
    // Validation
    if (!renameOldName.trim()) {
      toast.error("Please enter the current name of the item");
      return;
    }
    
    if (!renameNewName.trim()) {
      toast.error("Please enter a new name for the item");
      return;
    }
    
    if (renameNewName.includes("/")) {
      toast.error("File/folder name cannot contain '/' character");
      return;
    }
    
    if (renameOldName === renameNewName) {
      toast.error("New name must be different from current name");
      return;
    }
    
    // For root level, path should be empty array
    const pathArray = renamePath ? renamePath.split("/").filter(p => p.trim()) : [];
    
    // Dispatch action
    const result = dispatch(renameItem({ path: pathArray, oldName: renameOldName, newName: renameNewName }));
    
    // Clear form
    setRenameOldName("");
    setRenameNewName("");
    toast.success(`"${renameOldName}" renamed to "${renameNewName}" successfully`);
  };

  const handleDelete = () => {
    // Validation
    if (!deleteName.trim()) {
      toast.error("Please enter the name of the item to delete");
      return;
    }
    
    // Show delete modal instead of directly dispatching
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // For root level, path should be empty array
    const pathArray = deletePath ? deletePath.split("/").filter(p => p.trim()) : [];
    
    // Dispatch action
    const result = dispatch(deleteItem({ path: pathArray, name: deleteName }));
    
    // Clear form
    setDeleteName("");
    toast.success(`"${deleteName}" deleted successfully`);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col gap-3 mb-3 bg-white p-3 rounded-md shadow">
      <h3 className="font-semibold text-sm">⚙️ File Operations</h3>
      
      {/* Tabs */}
      <div className="flex flex-wrap border-b">
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === "create" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("create")}
        >
          Create
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === "rename" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("rename")}
        >
          Rename
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === "delete" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("delete")}
        >
          Delete
        </button>
      </div>

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="flex flex-col gap-2">
          <input
            placeholder="Parent path (e.g. Documents/Projects)"
            value={createPath}
            onChange={(e) => setCreatePath(e.target.value)}
            className="border p-2 rounded text-sm"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              placeholder="New file/folder name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="border p-2 rounded text-sm flex-grow"
            />
            <select
              value={createType}
              onChange={(e) => setCreateType(e.target.value)}
              className="border p-2 rounded text-sm"
            >
              <option value="file">File</option>
              <option value="folder">Folder</option>
            </select>
            <button
              onClick={handleCreate}
              className="bg-green-500 text-white px-4 py-2 rounded text-sm whitespace-nowrap"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Rename Tab */}
      {activeTab === "rename" && (
        <div className="flex flex-col gap-2">
          <input
            placeholder="Parent path (e.g. Documents/Projects)"
            value={renamePath}
            onChange={(e) => setRenamePath(e.target.value)}
            className="border p-2 rounded text-sm"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              placeholder="Current name"
              value={renameOldName}
              onChange={(e) => setRenameOldName(e.target.value)}
              className="border p-2 rounded text-sm flex-grow"
            />
            <input
              placeholder="New name"
              value={renameNewName}
              onChange={(e) => setRenameNewName(e.target.value)}
              className="border p-2 rounded text-sm flex-grow"
            />
            <button
              onClick={handleRename}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm whitespace-nowrap"
            >
              Rename
            </button>
          </div>
        </div>
      )}

      {/* Delete Tab */}
      {activeTab === "delete" && (
        <div className="flex flex-col gap-2">
          <input
            placeholder="Parent path (e.g. Documents/Projects)"
            value={deletePath}
            onChange={(e) => setDeletePath(e.target.value)}
            className="border p-2 rounded text-sm"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              placeholder="Name to delete"
              value={deleteName}
              onChange={(e) => setDeleteName(e.target.value)}
              className="border p-2 rounded text-sm flex-grow"
            />
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemName={deleteName}
        itemPath={deletePath ? deletePath.split("/").filter(p => p.trim()) : []}
      />
    </div>
  );
}