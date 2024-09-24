import React, { useEffect, useState } from "react";

const Toast = ({ message, show, type = "success", duration = 3000 }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!visible) return null;

  const toastStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${toastStyles[type]}`}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;
