import { useState, useEffect } from "react";
import { GameStates } from "../types";
import { CreatePlayerForm } from "./PAGES/CreatePlayerForm";
import { Game } from "./PAGES/Game";
import { useGame } from "./hooks/useGame";
import { Home } from "./PAGES/Home";
import { Socket } from 'socket.io-client';
import { useOnlineGame } from "./hooks/useOnlineGame";
import { getUserId } from "../func/gameFunc";

function App() {
  const [isHome, setIsHome] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false)
  const [players, setPlayers] = useState<string[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false); // État pour suivre la connexion du socket
  
  // Utilisation de useGame (pour le mode hors ligne)
  const { state: offlineState, send: sendOffline, context: offlineContext, subState: offlineSubState, setSubState: offlineSetSubState } = useGame();
  
  // Utilisation de useOnlineGame si le jeu est en ligne
  const { state: onlineState, send: sendOnline, socket, context: onlineContext, sendWithValidations: sendWithValidation, subState: onlineSubState, requestSubStateChange: onlineSetSubState  } = useOnlineGame(roomId);
  
  useEffect(() => {
    console.log("usedEffect", socket)
    if (socket) {
      // Vérifiez si le socket est connecté
      const handleConnect = () => {
        console.log("Socket connecté avec l'ID dans APP:", socket.id);
        setIsSocketConnected(true);
      };
      
      const handleDisconnect = () => {
        console.log("Socket déconnecté dans APP:", socket.id);
        setIsSocketConnected(false);
      };
      
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      
      // Récupérer le paramètre `room` de l'URL
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      
      if (roomParam && socket) {
        // Si une salle est spécifiée dans l'URL, tenter de la rejoindre
        handleJoinPrivateGame(roomParam, socket);
      }
      
      socket.on('privateGameCreated', (id) => {
        setRoomId(id);
        setIsHome(false); // Passer à l'écran de lobby
        console.log(`Partie privée créée avec l'ID : ${id}`);
        handleUpdateUrl(id); // Mettre à jour l'URL de la page pour la partie privée
      });
      
      socket.on('updateGameState', (gameState) => {
        console.log('État du jeu mis à jour:', gameState);
        // Mettre à jour l'état de la machine de jeu ici si nécessaire
      });
      
      socket.on('roomFull', () => {
        alert('La salle est pleine, vous ne pouvez pas rejoindre.');
      });
      
      socket.on('roomNotFound', () => {
        alert('La salle n\'existe pas.');
      });

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket, roomId]);
  
  const handleUpdateUrl = (id: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set('room', id);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`)
  }
  
  const handleCreatePrivateGame = () => {
    console.log(socket)
    if (socket) {
      console.log('Socket est connecté:', socket.connected); // Vérifiez si le socket est connecté
      setIsHome(false); // Passer à l'écran de création de joueurs
      setIsOnline(true); // Indiquer que l'utilisateur est en ligne (optionnel)
      socket.emit('createPrivateGame'); // Émettre l'événement pour créer une partie
      console.log('Création de partie privée émise');
    } else {
      console.error('Socket non disponible');
    }
  };
  
  // Fonction pour rejoindre une salle privée
  const handleJoinPrivateGame = (roomId: string, socket: Socket) => {
    const playerData = getUserId();
    console.log('player:', playerData) // Données du joueur, à personnaliser
    setRoomId(roomId);
    setIsHome(false); // Quitter l'écran d'accueil
    setIsOnline(true)
    socket.emit('joinPrivateGame', roomId, playerData);
  };
  
  // Selon que le jeu est en ligne ou hors ligne, utiliser le bon état et envoyer des événements au bon endroit
  const state = isOnline ? onlineState : offlineState;
  const send = isOnline ? sendOnline : sendOffline;
  const context = isOnline ? onlineContext : offlineContext;
  const sendWithValidations = isOnline ? sendWithValidation : sendOffline;
  const subState = isOnline ? onlineSubState : offlineSubState;
  const setSubState = isOnline ? onlineSetSubState : offlineSetSubState;
  
  return (
    <>
    {isHome && <Home 
      onClickPrivate={handleCreatePrivateGame} // Appeler la fonction pour créer une partie
      onClickSolo={() => setIsHome(false)} 
      onClickMulti={() => {}} 
      />}
      
      
      {!isHome && state === GameStates.LOBBY && (
        <CreatePlayerForm 
        isOnline={isOnline} 
        onIdDefined={(id) => setPlayers([id, ...players])} 
        onIdDelete={(id) => setPlayers(players.filter(p => p !== id))}
        context={context}
        send={send}
        sendWithValidations={sendWithValidations} 
        /> 
      )}
      
      
      {!isHome && (state === GameStates.TURN || state === GameStates.RESOLUTION) && (
        <Game 
          playerOne={players[0]}
          playerTwo={players[1]}
          context={context}
          send={send}
          sendWithValidations={sendWithValidations}
          state={state} 
          subState={subState!} 
          setSubState={setSubState}
          isOnline={isOnline}  
        />
      )}        
      </>
    );
  }
  
  export default App;
  