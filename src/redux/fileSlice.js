import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  structure: { name: "root", type: "folder", children: [] },
  selectedFile: null,
  error: null,
  searchQuery: "", 
  searchResults: [], 
};

function findNodeByPath(root, path) {

  if (!Array.isArray(path)) path = [];
  

  if (!path.length) return root;
  

  let current = root;
  for (let i = 0; i < path.length; i++) {
    if (!current.children) return null;
    const child = current.children.find((c) => c.name === path[i]);
    if (!child) return null;
    current = child;
  }
  return current;
}

function updateTree(root, path, callback) {

  if (!Array.isArray(path)) path = [];
  

  if (path.length === 0) {
    callback(root);
    return true;
  }
  

  let current = root;
  for (let i = 0; i < path.length - 1; i++) {
    if (!current.children) return false;
    const child = current.children.find((c) => c.name === path[i]);
    if (!child) return false;
    current = child;
  }
  

  if (!current.children) return false;
  const targetName = path[path.length - 1];
  const child = current.children.find((c) => c.name === targetName);
  if (child) {

    callback(child);
    return true;
  }
  return false;
}


function searchNodes(node, query, results = []) {
  if (node.name.toLowerCase().includes(query.toLowerCase())) {
    results.push(node);
  }
  
  if (node.children) {
    node.children.forEach(child => searchNodes(child, query, results));
  }
  
  return results;
}

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setStructure: (state, action) => {
      state.structure = action.payload;
    },
    selectFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    createItem: (state, action) => {
      const { path, name, type } = action.payload;
      let success = false;
      

      const parentNode = findNodeByPath(state.structure, path);
      if (!parentNode) {
        state.error = `Could not create item: parent folder "${path.join('/') || 'root'}" not found`;
        return;
      }
      
      if (!parentNode.children) parentNode.children = [];
      

      if (parentNode.children.some((c) => c.name === name)) {
        state.error = `Could not create item: "${name}" already exists in "${path.length ? path[path.length - 1] : 'root'}"`;
        return;
      }
      

      parentNode.children.push({ 
        name, 
        type, 
        children: type === "folder" ? [] : undefined 
      });
      success = true;
    },
    renameItem: (state, action) => {
      const { path, oldName, newName } = action.payload;
      let success = false;
      
   
      const parentNode = findNodeByPath(state.structure, path);
      if (!parentNode || !parentNode.children) {
        state.error = `Could not rename item: parent folder "${path.join('/') || 'root'}" not found`;
        return;
      }
      
      const item = parentNode.children.find((c) => c.name === oldName);
      if (!item) {
        state.error = `Could not rename item: "${oldName}" not found in "${path.length ? path[path.length - 1] : 'root'}"`;
        return;
      }
      
   
      if (parentNode.children.some((c) => c.name === newName)) {
        state.error = `Could not rename item: "${newName}" already exists in "${path.length ? path[path.length - 1] : 'root'}"`;
        return;
      }
      

      item.name = newName;
      success = true;
    },
    deleteItem: (state, action) => {
      const { path, name } = action.payload;
      let success = false;
      
  
      const parentNode = findNodeByPath(state.structure, path);
      if (!parentNode || !parentNode.children) {
        state.error = `Could not delete item: parent folder "${path.join('/') || 'root'}" not found`;
        return;
      }
      
      const initialLength = parentNode.children.length;
      parentNode.children = parentNode.children.filter((c) => c.name !== name);
      if (parentNode.children.length < initialLength) {
        success = true;
      } else {
        state.error = `Could not delete item: "${name}" not found in "${path.length ? path[path.length - 1] : 'root'}"`;
      }
    },
  
    moveItem: (state, action) => {
      const { sourcePath, sourceName, targetPath } = action.payload;
      

      const sourceParentNode = findNodeByPath(state.structure, sourcePath);
      if (!sourceParentNode || !sourceParentNode.children) {
        state.error = `Could not move item: source folder "${sourcePath.join('/') || 'root'}" not found`;
        return;
      }
      

      const itemIndex = sourceParentNode.children.findIndex(c => c.name === sourceName);
      if (itemIndex === -1) {
        state.error = `Could not move item: "${sourceName}" not found in "${sourcePath.length ? sourcePath[sourcePath.length - 1] : 'root'}"`;
        return;
      }
      
 
      const [item] = sourceParentNode.children.splice(itemIndex, 1);
      
  
      const targetNode = findNodeByPath(state.structure, targetPath);
      if (!targetNode) {
    
        sourceParentNode.children.splice(itemIndex, 0, item);
        state.error = `Could not move item: target folder "${targetPath.join('/') || 'root'}" not found`;
        return;
      }
      
 
      if (targetNode.type !== "folder") {
    
        sourceParentNode.children.splice(itemIndex, 0, item);
        state.error = `Could not move item: "${targetNode.name}" is not a folder`;
        return;
      }
      
 
      if (targetNode.children && targetNode.children.some(c => c.name === item.name)) {
    
        sourceParentNode.children.splice(itemIndex, 0, item);
        state.error = `Could not move item: "${item.name}" already exists in "${targetNode.name}"`;
        return;
      }
      

      if (!targetNode.children) targetNode.children = [];
      targetNode.children.push(item);
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    performSearch: (state, action) => {
      const query = action.payload;
      if (!query.trim()) {
        state.searchResults = [];
        return;
      }
      
      const results = searchNodes(state.structure, query);
      state.searchResults = results;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setStructure,
  selectFile,
  createItem,
  renameItem,
  deleteItem,
  moveItem,
  setSearchQuery,
  setSearchResults,
  performSearch,
  setError,
  clearError,
} = fileSlice.actions;
export default fileSlice.reducer;