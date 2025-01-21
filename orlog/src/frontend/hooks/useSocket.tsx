import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getUserId } from '../../func/gameFunc';

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null); // Utiliser useState au lieu de useRef

  useEffect(() => {
    const userId = getUserId();

    const socketInstance = io(url, {
      query: { userId }, // Envoyer l'ID utilisateur avec la connexion
      reconnectionAttempts: 5, // Permettre plusieurs tentatives de reconnexion
      reconnectionDelay: 1000, // Délai entre les tentatives de reconnexion
    });
    setSocket(socketInstance); // Mettre à jour l'état avec le nouveau socket

    const handleConnect = () => {
      console.log('Socket connecté avec l\'ID:', socketInstance.id);
    };

    const handleDisconnect = () => {
      console.log('Socket déconnecté');
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [url]);

  return socket; // Retourner le socket
};
