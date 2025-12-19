import React, { createContext, useContext, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ConfirmationContext = createContext(null);

export const useConfirmation = () => useContext(ConfirmationContext);

export const ConfirmationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState({});
  const [handler, setHandler] = useState(null);

  const confirm = (message, onConfirm) => {
    setContent({ message });
    setHandler(() => onConfirm); // Use a function wrapper to store the callback
    setIsOpen(true);

  };

  const handleConfirm = () => {
    if (handler) {
      handler(); // Execute the stored handler
    }
    setIsOpen(false);
    setHandler(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setHandler(null);
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}

      {isOpen && (
        <ConfirmationModal
          message={content.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmationContext.Provider>
  );
};
export const useConfirm = () => useContext(ConfirmationContext);
