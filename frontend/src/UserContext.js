// src/UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    return (
        <UserContext.Provider value={{ onlineUsers, setOnlineUsers }}>
            {children}
        </UserContext.Provider>
    );
};
