# File Explorer Application

A React-based file explorer application built with Next.js 16, React 19, and Redux Toolkit.

## Features

- Tree-like file structure navigation
- Expand/collapse directories
- File and folder icons
- Create new files and folders
- Rename existing files and folders
- Delete files and folders with confirmation modal
- View file content
- Drag-and-drop functionality for reorganizing files and folders
- Search functionality to quickly locate files and folders
- Error handling and validation with Toast notifications
- Responsive design for all device sizes
- Intuitive user interface with clear feedback

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd my-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.js        # Root layout with ToastContainer
│   └── page.js          # Main page
├── component/           # React components
│   ├── FileExplorer.js  # Main file explorer component with search
│   ├── FileNode.js      # File/folder node component with drag-and-drop
│   ├── FileActions.js   # File operations component
│   ├── DeleteModal.js   # Custom delete confirmation modal
│   ├── ErrorModal.js    # Error display component (now using Toastify)
│   └── dataholder.json  # Initial file structure data
├── redux/               # Redux store and slices
│   └── fileSlice.js     # File system state management
└── store.js             # Redux store configuration
```

## Usage

### Navigation
- Click on folders to expand/collapse them
- Click on files to view them in the viewer panel

### Creating Items
1. Use the "Create" tab in the operations panel to create new files or folders
2. Specify the parent path (e.g., "Documents/Projects") and the name of the new item
3. Select whether to create a file or folder

### Renaming Items
1. Use the "Rename" tab in the operations panel
2. Specify the parent path, current name, and new name
3. Or use the inline "Rename" button next to any file or folder

### Deleting Items
1. Use the "Delete" tab in the operations panel
2. Specify the parent path and name of the item to delete
3. Or click the "Delete" button next to any file or folder
4. Confirm deletion in the custom modal dialog

### Drag-and-Drop Operations
1. Click and hold on any file or folder
2. Drag it over another folder (indicated by blue highlight)
3. Release to move the item to the new location

### Search Functionality
1. Type in the search box at the top of the file explorer
2. See real-time results as you type
3. Click on any result to view it
4. Clear the search box to return to the full file tree

### Inline Operations
- Each folder has inline "New", "Expand", "Rename", and "Delete" buttons
- Each file has inline "Rename" and "Delete" buttons
- All operations provide clear feedback through Toast notifications

## Technologies Used

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://reactjs.org/) - Frontend library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Toastify](https://fkhadra.github.io/react-toastify/) - Notification library

## Code Organization

The application follows a modular component structure:

- **State Management**: Redux Toolkit is used for centralized state management of the file system
- **Component Structure**: Components are organized logically with clear separation of concerns
- **File Operations**: All file operations (create, rename, delete, move) are handled through Redux actions
- **UI Components**: Reusable components for consistent user experience
- **Error Handling**: Comprehensive error handling with user-friendly notifications

## User Experience Features

- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Visual Feedback**: Clear visual cues for drag-and-drop, hover states, and active elements
- **Non-blocking Notifications**: Toast notifications for success and error messages
- **Confirmation Dialogs**: Custom modal for delete operations to prevent accidental data loss
- **Intuitive Navigation**: Familiar file explorer interface with expandable tree structure
- **Search Functionality**: Quick search to find files and folders
- **Drag-and-Drop**: Intuitive file organization through drag-and-drop

## Testing

To test the application:

1. Run the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000) in your browser
3. Test all functionality:
   - Create files and folders at various levels
   - Rename items
   - Delete items with confirmation
   - Drag and drop files between folders
   - Search for files and folders
   - View files in the viewer panel
   - Test responsive design on different screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.