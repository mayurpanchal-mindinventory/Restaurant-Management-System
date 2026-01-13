import React, { createContext, useContext, useState } from 'react';

const ServerStatusContext = createContext(null);

export const ServerStatusProvider = ({ children }) => {
    const [isServerDown, setIsServerDown] = useState(false);

    const setServerDown = (status) => setIsServerDown(status);

    return (
        <ServerStatusContext.Provider value={{ isServerDown, setServerDown }}>
            {children}
        </ServerStatusContext.Provider>
    );
};

export const useServerStatus = () => useContext(ServerStatusContext);
