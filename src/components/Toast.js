import React, { useEffect, useState } from "react";

const Toast = ({ message, type = "success", duration = 3000 }) => {
  const [visible, setVisible] = useState(true);  // Always starts as visible
  const [progress, setProgress] = useState(0); // Progress for the bar

  useEffect(() => {
    if (message) {
      setVisible(true);  // Show when there's a message
      setProgress(0); // Reset progress
      const timer = setTimeout(() => setVisible(false), duration);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100; // Ensure it ends at 100%
          }
          return prev + (100 / (duration / 100)); // Update progress
        });
      }, 100);

      return () => {
        clearTimeout(timer);  // Clear timer on unmount or message change
        clearInterval(interval); // Clear progress interval
      };
    }
  }, [message, duration]);

  if (!visible || !message) return null;  // Hide if no message or not visible

  const toastStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${toastStyles[type]}`}>
      <p>{message}</p>
      <div className="h-1 bg-gray-200 rounded mt-2">
        <div
          className={`h-full rounded bg-white`}
          style={{ width: `${progress}%`, transition: 'width 0.1s' }} // Set progress width
        />
      </div>
    </div>
  );
};

export default Toast;
