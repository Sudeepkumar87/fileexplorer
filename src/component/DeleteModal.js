"use client";
import { useDispatch } from "react-redux";
import { deleteItem } from "@/redux/fileSlice";
import { toast } from 'react-toastify';

export default function DeleteModal({ isOpen, onClose, itemName, itemPath }) {
  const dispatch = useDispatch();

  const handleConfirmDelete = () => {
    // Dispatch the delete action
    const pathArray = Array.isArray(itemPath) ? itemPath : 
                     itemPath ? itemPath.split("/").filter(p => p.trim()) : [];
    
    dispatch(deleteItem({ path: pathArray, name: itemName }));
    toast.success(`"${itemName}" deleted successfully`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/20 backdrop-blur-[2px]">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-6">
          Are you sure you want to delete <strong>"{itemName}"</strong>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}