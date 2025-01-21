import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; 
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid'; // Pour générer des IDs aléatoires
import { makeGame } from '../orlog/src/machine/gameMachine';
import { subStates } from '../orlog/src/types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

interface Player {
  id: string | undefined;
}

interface GameRoom {
  players: Player[];
  gameState: any; // Remplacez any par le type de votre machine à état si vous le pouvez
  playerReady: string[];
  subState: subStates; // Sous État actuel du jeu
}

const gameRooms:Record<string, GameRoom> = {}; // Stocker les salles de jeu

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId?.toString(); // Récupérer l'ID utilisateur fourni par le client
  if (!userId) {
    console.error(`Connexion refusée : userId non défini pour le socket ${socket.id}`);
    socket.disconnect(); // Déconnecter si l'ID utilisateur est absent
    return;
  }
  console.log(`Un client connecté avec userId : ${userId} et socketId : ${socket.id}`);
  
  // Vérifier si l'utilisateur est déjà connecté avec un autre socket
  for (const roomId in gameRooms) {
    const room = gameRooms[roomId];
    const existingPlayer = room.players.find(player => player.id === userId);
    if (existingPlayer) {
      // L'utilisateur est déjà dans cette salle avec un autre socket, le reconnecter
      console.log(`Reconnexion de l'utilisateur ${userId} à la salle : ${roomId}`);
      socket.join(roomId);
      io.to(roomId).emit('updatePlayers', room.players); // Émettre la mise à jour de la liste des joueurs
      break;
    }
  }
  
  // Créer une salle privée
  socket.on('createPrivateGame', () => {
    console.log('Créer une partie privée demandée');
    const roomId = uuidv4(); // Générer une nouvelle ID de salle
    const gameService = makeGame(); // Créer la machine à état pour la salle

    gameRooms[roomId] = { players: [], gameState: gameService, playerReady: [], subState: subStates.throw }; // Initialiser la salle

    socket.join(roomId); // Ajouter le socket au salon
    console.log(`Partie privée créée : ${roomId}`);
    socket.emit('privateGameCreated', roomId); // Envoyer l'ID de la salle au créateur
  });
  
  // Rejoindre une salle privée
  socket.on('joinPrivateGame', (roomId, playerData) => {
    const room = gameRooms[roomId];
    
    if (room) {
      // Vérification si l'utilisateur est déjà dans la salle
      const playerExists = room.players.some(player => player === playerData);
      
      if (!playerExists) {
        // Ajouter le joueur si la salle n'est pas pleine
        if (room.players.length < 2) {
          room.players.push(playerData); // Ajouter le joueur à la salle
          socket.join(roomId); // Ajouter le socket au salon
          console.log(`${playerData} a rejoint la salle : ${roomId}`);
          io.to(roomId).emit('updatePlayers', room.players); // Émettre la liste des joueurs
        } else {
          socket.emit('roomFull'); // Salle pleine
        }
      } else {
        console.log(`Le joueur avec l'ID : ${playerData} est déjà dans la salle : ${roomId}`);
        socket.emit('alreadyInRoom'); // Optionnel : message personnalisé
      }
    } else {
      socket.emit('roomNotFound'); // Salle introuvable
    }
    console.log('players in room', room.players, room.players.length)
  });
  
  // Mettre à jour l'état du jeu en envoyant un événement à la machine à état
  socket.on('updateGameState', (roomId, event) => {
    console.log(roomId, event);
    const room = gameRooms[roomId];
    if (room) {
      const gameService = room.gameState;
      gameService.send(event); // Envoyer l'événement à la machine
      console.log(gameService.state.context, gameService.state.value)
      // Émettre le nouvel état à tous les joueurs de la salle
      io.to(roomId).emit('gameStateUpdated', {
        state: gameService.state.value,
        context: gameService.state.context
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Un client déconnecté :', socket.id);
  });
  
  // Mettre à jour l'état du jeu en envoyant un événement à la machine à état si tous les joueurs sont prêts
  socket.on('updateGameStateWithAllPlayerValidation', (roomId, event, player: string) => {
    console.log(roomId, event, player);
    const room = gameRooms[roomId];
    
    if (room) {
      const gameService = room.gameState;
      
      // Vérifier si le joueur est déjà dans la liste "playerReady" pour éviter les doublons
      if (!room.playerReady.includes(player)) {
        room.playerReady.push(player); // Ajouter le joueur à la liste des joueurs prêts
        console.log(player, "is ready")
      }
      
      // Si tous les joueurs sont prêts, envoyer l'événement à la machine
      if (room.playerReady.length === room.players.length) {
        console.log("All players are ready")
        gameService.send(event); // Envoyer l'événement à la machine
        console.log(gameService.state.context, gameService.state.value);
        
        // Émettre le nouvel état à tous les joueurs de la salle
        io.to(roomId).emit('gameStateUpdated', {
          state: gameService.state.value,
          context: gameService.state.context,
        });
        
        // Réinitialiser la liste des joueurs prêts après avoir envoyé l'événement
        room.playerReady = [];
      }
    }
  });
  
  //Actualise le sous état du jeu
  socket.on('requestSubStateChange', (roomId, nextSubState) => {
    // Fonction pour mettre à jour subState et informer les clients
    
    const room = gameRooms[roomId];
    if (room) {
      room.subState = nextSubState;
      io.to(roomId).emit('subStateUpdated', nextSubState);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Un client déconnecté :', socket.id);
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 4200;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});