"use client";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { selectFile, deleteItem, createItem, renameItem, moveItem } from "@/redux/fileSlice";
import { toast } from 'react-toastify';
import DeleteModal from "./DeleteModal";

export default function FileNode({ node, path = [], onDragStart, onDragOver, onDrop }) {
  const [expanded, setExpanded] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRenameForm, setShowRenameForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [createName, setCreateName] = useState("");
  const [createType, setCreateType] = useState("file");
  const [isDragOver, setIsDragOver] = useState(false);
  const dispatch = useDispatch();
  const nodeRef = useRef(null);

  const handleClick = () => {
    if (node.type === "file") {
      dispatch(selectFile(node.name));
    } else {
      setExpanded(!expanded);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    // Show custom delete modal instead of browser alert
    setShowDeleteModal(true);
  };

  const handleCreate = (e) => {
    e.stopPropagation();
    
    // Validation
    if (!createName.trim()) {
      toast.error("Please enter a name for the new item");
      return;
    }
    
    if (createName.includes("/")) {
      toast.error("File/folder name cannot contain '/' character");
      return;
    }
    
    // Path to the current node where we want to create the item
    // For root node, path should be empty array
    // For other nodes, path should include the full path to that node
    const createPath = node.name === "root" ? [] : [...path, node.name];
    
    const result = dispatch(createItem({ 
      path: createPath, 
      name: createName, 
      type: createType 
    }));
    
    setCreateName("");
    setShowCreateForm(false);
    toast.success(`"${createName}" created successfully`);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    
    // Validation
    if (!newName.trim()) {
      toast.error("Please enter a new name");
      return;
    }
    
    if (newName.includes("/")) {
      toast.error("File/folder name cannot contain '/' character");
      return;
    }
    
    if (node.name === newName) {
      toast.error("New name must be different from current name");
      return;
    }
    
    // Path to the current node's parent
    const result = dispatch(renameItem({ 
      path, 
      oldName: node.name, 
      newName 
    }));
    
    setNewName("");
    setShowRenameForm(false);
    toast.success(`"${node.name}" renamed to "${newName}" successfully`);
  };

  // Drag and drop handlers
  const handleDragStart = (e) => {
    e.stopPropagation();
    // Only allow dragging of files and folders (not root)
    if (node.name !== "root") {
      e.dataTransfer.setData("text/plain", JSON.stringify({ 
        name: node.name, 
        path: path,
        type: node.type
      }));
      if (onDragStart) onDragStart(e, node, path);
      e.dataTransfer.effectAllowed = "move";
    } else {
      e.preventDefault();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow dropping on folders
    if (node.type === "folder") {
      setIsDragOver(true);
      if (onDragOver) onDragOver(e, node, path);
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    // Only allow dropping on folders
    if (node.type === "folder") {
      try {
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        // Don't allow dropping onto self
        if (data.name === node.name && JSON.stringify(data.path) === JSON.stringify(path)) {
          toast.error("Cannot move item to itself");
          return;
        }
        
        // Dispatch move action
        const result = dispatch(moveItem({
          sourcePath: data.path,
          sourceName: data.name,
          targetPath: node.name === "root" ? [] : [...path, node.name]
        }));
        
        toast.success(`"${data.name}" moved to "${node.name}" successfully`);
        
        if (onDrop) onDrop(e, node, path);
      } catch (error) {
        console.error("Error parsing drag data:", error);
        toast.error("Error moving item: Invalid data format");
      }
    } else {
      toast.error("Can only drop items into folders");
    }
  };

  return (
    <div 
      className="ml-0 sm:ml-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={nodeRef}
    >
      <div
        className={`cursor-pointer flex flex-wrap justify-between items-center p-2 rounded-md ${
          isDragOver ? 'bg-blue-200' : 'hover:bg-gray-200'
        } ${node.name !== "root" ? 'draggable' : ''}`}
        onClick={handleClick}
        draggable={node.name !== "root"}
        onDragStart={handleDragStart}
      >
        <div className="flex items-center mb-1 sm:mb-0">
          {node.type === "folder" ? "📁" : "📄"} {node.name}
        </div>
        {node.name !== "root" && (
          <div className="flex flex-wrap gap-1">
            {node.type === "folder" && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCreateForm(!showCreateForm);
                    setShowRenameForm(false);
                  }}
                  className="text-green-500 text-xs px-2 py-1 hover:underline"
                >
                  New
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(true);
                  }}
                  className="text-blue-500 text-xs px-2 py-1 hover:underline"
                >
                  Expand
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRenameForm(!showRenameForm);
                setShowCreateForm(false);
              }}
              className="text-yellow-500 text-xs px-2 py-1 hover:underline"
            >
              Rename
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 text-xs px-2 py-1 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemName={node.name}
        itemPath={path}
      />
      
      {/* Rename Form */}
      {showRenameForm && (
        <div className="ml-0 sm:ml-4 mt-2 mb-2 p-3 bg-white rounded border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New name"
              className="border p-2 rounded text-sm flex-grow"
              autoFocus
            />
            <div className="flex gap-1">
              <button
                onClick={handleRename}
                className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRenameForm(false);
                  setNewName("");
                }}
                className="bg-gray-500 text-white px-3 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Form */}
      {showCreateForm && (
        <div className="ml-0 sm:ml-4 mt-2 mb-2 p-3 bg-white rounded border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Name"
              className="border p-2 rounded text-sm flex-grow"
              autoFocus
            />
            <select
              value={createType}
              onChange={(e) => setCreateType(e.target.value)}
              className="border p-2 rounded text-sm"
            >
              <option value="file">File</option>
              <option value="folder">Folder</option>
            </select>
            <div className="flex gap-1">
              <button
                onClick={handleCreate}
                className="bg-green-500 text-white px-3 py-2 rounded text-sm"
              >
                Create
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCreateForm(false);
                  setCreateName("");
                }}
                className="bg-gray-500 text-white px-3 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {expanded &&
        node.children &&
        node.children.map((child, i) => (
          <FileNode 
            key={i} 
            node={child} 
            path={node.name === "root" ? [] : [...path, node.name]} 
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
    </div>
  );
}