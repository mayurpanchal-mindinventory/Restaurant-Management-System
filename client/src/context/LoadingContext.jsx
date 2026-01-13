import React, { createContext, useState, useContext, useMemo } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);

  const value = useMemo(() => ({
    isLoading: activeRequests > 0,
    showLoader: () => setActiveRequests((prev) => prev + 1),
    hideLoader: () => setActiveRequests((prev) => Math.max(0, prev - 1)),
  }), [activeRequests]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
