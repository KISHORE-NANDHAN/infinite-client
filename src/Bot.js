import React, { useState } from "react";
import Toast from "./components/Toast";

const App = () => {
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  return (
    <div className="App flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="mb-4 text-2xl">Toast Notification Example</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => showToast("Success! Operation completed.", "success")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Show Success Toast
        </button>
        <button
          onClick={() => showToast("Error! Something went wrong.", "error")}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Show Error Toast
        </button>
        <button
          onClick={() => showToast("Info! Here is some information.", "info")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Show Info Toast
        </button>
        <button
          onClick={() => showToast("Warning! Check this out.", "warning")}
          className="px-4 py-2 bg-yellow-500 text-black rounded"
        >
          Show Warning Toast
        </button>
      </div>
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
};

export default App;
