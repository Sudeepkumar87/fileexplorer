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
  
    setShowDeleteModal(true);
  };

  const handleCreate = (e) => {
    e.stopPropagation();
    

    if (!createName.trim()) {
      toast.error("Please enter a name for the new item");
      return;
    }
    
    if (createName.includes("/")) {
      toast.error("File/folder name cannot contain '/' character");
      return;
    }
    

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
    

    const result = dispatch(renameItem({ 
      path, 
      oldName: node.name, 
      newName 
    }));
    
    setNewName("");
    setShowRenameForm(false);
    toast.success(`"${node.name}" renamed to "${newName}" successfully`);
  };


  const handleDragStart = (e) => {
    e.stopPropagation();
   
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
    

    if (node.type === "folder") {
      try {
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));

        if (data.name === node.name && JSON.stringify(data.path) === JSON.stringify(path)) {
          toast.error("Cannot move item to itself");
          return;
        }
        
   
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
                  className="text-green-500 text-xs px-2 py-1 hover:underline cursor-pointer"
                >
                  New
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(true);
                  }}
                  className="text-blue-500 text-xs px-2 py-1 hover:underline cursor-pointer"
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
              className="text-yellow-500 text-xs px-2 py-1 hover:underline cursor-pointer"
            >
              Rename
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 text-xs px-2 py-1 hover:underline cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
  
      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemName={node.name}
        itemPath={path}
      />
      

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