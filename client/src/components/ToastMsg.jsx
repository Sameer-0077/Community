import { useState, useEffect } from "react";

export default function ToastMsg({ message, isVisible, onClose }) {
  // Auto-hide after 3 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 transition-all duration-300 z-50
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg`}
    >
      {message}
    </div>
  );
}
