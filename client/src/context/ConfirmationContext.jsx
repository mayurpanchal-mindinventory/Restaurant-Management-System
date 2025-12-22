import React, { createContext, useContext, useState } from "react";
import ConfirmationModal from './ConfirmationModal';

const ConfirmationContext = createContext(null);

export const ConfirmationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState({ title: "", message: "" });
  const [resolveCallback, setResolveCallback] = useState(null);

  const confirm = (config) => {
    return new Promise((resolve) => {
      if (typeof config === 'string') {
        setContent({ title: "Confirm", message: config });
      } else {
        setContent({
          title: config.title || "Confirm",
          message: config.message || ""
        });
      }
      setResolveCallback(() => resolve);
      setIsOpen(true);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveCallback) resolveCallback(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolveCallback) resolveCallback(false);
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {isOpen && (
        <ConfirmationModal
          title={content.title}
          message={content.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmationProvider");
  }
  return context;
};
