import React, { useEffect, useState } from "react";

interface AlertProps {
  message?: string;
  type: "error" | "message" | "alert";
  position: "top" | "bottom" | "left-bottom" | "right-bottom" | "left-top" | "right-top";
  children?: React.ReactNode;
  duration?: number; 
  restartAlert: () => void; // Function to restart the alert
}

const Alert: React.FC<AlertProps> = ({ restartAlert, message, type, position, children, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    setIsVisible(true);

    // Set initial animation styles based on position
    const initialStyles: Record<string, React.CSSProperties> = {
      top: { transform: "translateY(-100%)", opacity: 0 },
      bottom: { transform: "translateY(100%)", opacity: 0 },
      "left-bottom": { transform: "translateX(-100%)", opacity: 0 },
      "right-bottom": { transform: "translateX(100%)", opacity: 0 },
      "left-top": { transform: "translateX(-100%)", opacity: 0 },
      "right-top": { transform: "translateX(100%)", opacity: 0 },
    };

    setStyle(initialStyles[position]);

    // Animate to visible state
    setTimeout(() => {
      setStyle({ transform: "translate(0, 0)", opacity: 1, transition: "all 0.5s ease-out" });
    }, 50);    // Trigger fade-out after the specified duration
    const timeout = setTimeout(() => {
      setStyle({ transform: "translate(0, 0)", opacity: 0, transition: "all 0.5s ease-out" });
      setTimeout(() => {
        setIsVisible(false);
        restartAlert(); // Call the restart function after fade-out
      }, 500); // Remove from DOM after fade-out
    }, duration);    return () => clearTimeout(timeout); // Cleanup timeout
  }, [position, duration, restartAlert]);

  if (!isVisible) return null;

  const typeClasses = {
    error: "bg-red-500 text-white",
    message: "bg-blue-500 text-white",
    alert: "bg-yellow-500 text-black",
  };

  const positionClasses = {
    top: "top-4 left-1/2 transform -translate-x-1/2",
    bottom: "bottom-4 left-1/2 transform -translate-x-1/2",
    "left-bottom": "bottom-4 left-4",
    "right-bottom": "bottom-4 right-4",
    "left-top": "top-4 left-4",
    "right-top": "top-4 right-4",
  };
  return (
    <div
      className={`fixed z-[9999] px-20 py-7 rounded-2xl shadow-lg ${typeClasses[type]} ${
        positionClasses[position]
      }`}
      style={style}
    >
      {message ? <p>{message}</p> : children}
    </div>
  );
};

export default Alert;