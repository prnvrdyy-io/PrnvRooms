import { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only connect if the user is authenticated. 
    // This saves server resources from anonymous connections.
    if (isAuthenticated) {
      const socketInstance = socketService.connect();
      setSocket(socketInstance);
    } else {
      socketService.disconnect();
      setSocket(null);
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
