// Import necessary modules and components from React and Draft.js
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css'; // Import Draft.js default styles
import io from 'socket.io-client'; // Import Socket.io client for real-time communication

// Establish a WebSocket connection to the server running on localhost:3001
const socket = io('http://localhost:3001');

const CollaborativeEditor = () => {
  // Initialize the editor state with an empty editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // useEffect hook to handle side effects, such as WebSocket events
  useEffect(() => {
    // Set up a WebSocket listener for 'editor-change' events from the server
    socket.on('editor-change', (newState) => {
      // Update the editor state with the new content received from the server
      setEditorState(EditorState.createWithContent(convertFromRaw(newState)));
    });

    // Cleanup function to remove the WebSocket listener when the component is unmounted
    return () => {
      socket.off('editor-change');
    };
  }, []);

  // Function to handle changes in the editor state
  const handleChange = (state) => {
    // Update the local editor state
    setEditorState(state);
    // Emit an 'editor-change' event to the server with the raw content of the editor state
    socket.emit('editor-change', convertToRaw(state.getCurrentContent()));
  };

  // Render the Editor component from Draft.js
  return (
    <Editor
      editorState={editorState} // Pass the current editor state to the Editor component
      onChange={handleChange} // Pass the handleChange function to handle changes
    />
  );
};

// Export the CollaborativeEditor component as the default export of the module
export default CollaborativeEditor;
