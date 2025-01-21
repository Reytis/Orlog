import { useEffect, useState } from 'react';
import { GameStates, GameContext, GameEvents, subStates } from "../../types";
import { useSocket } from './useSocket';

export function useOnlineGame(roomId: string | null) {
    const socket = useSocket('http://localhost:4200');
    const [state, setState] = useState<GameStates>(GameStates.LOBBY); // Par défaut, l'état initial
    const [context, setContext] = useState<GameContext>({
        players: [],
        curentThrower: null,
        mainPlayer: null
    }); // Contexte du jeu, synchronisé avec le serveur
    const [subState, setSubState] = useState(); // Sous-état initialisé depuis le serveur
    
    // Effet pour se connecter au serveur lorsque le jeu est en ligne
    useEffect(() => {
        if (roomId && socket) {
            console.log('useOnlineGame connected my boy')
            // Recevoir les mises à jour d'état du serveur
            socket.on("gameStateUpdated", (updatedState) => {
                console.log("Nouvel état reçu du serveur:", updatedState);
                setState(updatedState.state); // Mettre à jour l'état local depuis le serveur
                setContext(updatedState.context); // Mettre à jour le contexte local depuis le serveur
            });
            
            // Écoute des mises à jour du sous-état (`subState`) depuis le serveur
            socket.on("subStateUpdated", (newSubState) => {
                console.log("Sous-état reçu du serveur:", newSubState);
                setSubState(newSubState); // Mise à jour du sous-état local
            });
            
            return () => {
                socket.off('gameStateUpdated'); // Nettoyage de l'écouteur
                socket.off("subStateUpdated");
            };
        }
    }, [roomId, socket]); // Ajoutez socket dans le tableau des dépendances
    
    // Fonction pour envoyer des événements au serveur
    const sendEvent = (event: GameEvents) => {
        if (socket) {
            console.log("Event envoyé", event);
            socket.emit("updateGameState", roomId, event);
        } else {
            console.error("Socket non initialisé"); // Avertir si le socket n'est pas initialisé
        }
    };
    
    // Fonction pour envoyer des événements au serveur
    const sendEventWithValidations = (event: GameEvents, player: string) => {
        if (socket) {
            console.log("Event envoyé", event);
            socket.emit("updateGameStateWithAllPlayerValidation", roomId, event, player);
        } else {
            console.error("Socket non initialisé"); // Avertir si le socket n'est pas initialisé
        }
    };
    
    // Fonction pour demander au serveur de changer le `subState`
    const requestSubStateChange = (newSubState: subStates) => {
        if (socket) {
            socket.emit("requestSubStateChange", roomId, newSubState); // Envoi au serveur
        } else {
            console.error("Socket non initialisé");
        }
    };
    
    
    
    return {
        state,       // L'état actuel du jeu (provenant du serveur)
        context,     // Le contexte actuel du jeu (provenant du serveur)
        subState,                 // Sous-état actuel
        requestSubStateChange,    // Demande de changement de sous-état au serveur
        send: sendEvent,  // Fonction pour envoyer des événements
        sendWithValidations: sendEventWithValidations, // Fonction pour envoyer des event avec validations de tout les joueurs
        can: () => true,   // Toujours permettre d'envoyer des événements, peut être ajusté si besoin
        socket: socket
    };
}
