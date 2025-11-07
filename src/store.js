import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './redux/fileSlice';

export const store = configureStore({
  reducer: { files: fileReducer }
});