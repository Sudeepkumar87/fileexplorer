"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "@/redux/fileSlice";
import { toast } from 'react-toastify';

export default function ErrorModal() {
  const { error } = useSelector((state) => state.files);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      // Clear the error after showing the toast
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // This component doesn't render anything directly since we're using Toastify
  return null;
}