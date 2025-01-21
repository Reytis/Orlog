"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var cors_1 = require("cors");
var uuid_1 = require("uuid"); // Pour générer des IDs aléatoires
var xstate_1 = require("xstate");
var gameMachine_ts_1 = require("../orlog/src/machine/gameMachine.ts");
var types_ts_1 = require("../orlog/src/types.ts");
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var gameRooms = {}; // Stocker les salles de jeu
io.on('connection', function (socket) {
    var _a;
    var userId = (_a = socket.handshake.query.userId) === null || _a === void 0 ? void 0 : _a.toString(); // Récupérer l'ID utilisateur fourni par le client
    if (!userId) {
        console.error("Connexion refus\u00E9e : userId non d\u00E9fini pour le socket ".concat(socket.id));
        socket.disconnect(); // Déconnecter si l'ID utilisateur est absent
        return;
    }
    console.log("Un client connect\u00E9 avec userId : ".concat(userId, " et socketId : ").concat(socket.id));
    // Vérifier si l'utilisateur est déjà connecté avec un autre socket
    for (var roomId in gameRooms) {
        var room = gameRooms[roomId];
        var existingPlayer = room.players.find(function (player) { return player.id === userId; });
        if (existingPlayer) {
            // L'utilisateur est déjà dans cette salle avec un autre socket, le reconnecter
            console.log("Reconnexion de l'utilisateur ".concat(userId, " \u00E0 la salle : ").concat(roomId));
            socket.join(roomId);
            io.to(roomId).emit('updatePlayers', room.players); // Émettre la mise à jour de la liste des joueurs
            break;
        }
    }
    // Créer une salle privée
    socket.on('createPrivateGame', function () {
        console.log('Créer une partie privée demandée');
        var roomId = (0, uuid_1.v4)(); // Générer une nouvelle ID de salle
        var gameService = (0, xstate_1.interpret)(gameMachine_ts_1.GameMachine).start(); // Créer la machine à état pour la salle
        gameRooms[roomId] = { players: [], gameState: gameService, playerReady: [], subState: types_ts_1.subStates.throw }; // Initialiser la salle
        socket.join(roomId); // Ajouter le socket au salon
        console.log("Partie priv\u00E9e cr\u00E9\u00E9e : ".concat(roomId));
        socket.emit('privateGameCreated', roomId); // Envoyer l'ID de la salle au créateur
    });
    // Rejoindre une salle privée
    socket.on('joinPrivateGame', function (roomId, playerData) {
        var room = gameRooms[roomId];
        if (room) {
            // Vérification si l'utilisateur est déjà dans la salle
            var playerExists = room.players.some(function (player) { return player === playerData; });
            if (!playerExists) {
                // Ajouter le joueur si la salle n'est pas pleine
                if (room.players.length < 2) {
                    room.players.push(playerData); // Ajouter le joueur à la salle
                    socket.join(roomId); // Ajouter le socket au salon
                    console.log("".concat(playerData, " a rejoint la salle : ").concat(roomId));
                    io.to(roomId).emit('updatePlayers', room.players); // Émettre la liste des joueurs
                }
                else {
                    socket.emit('roomFull'); // Salle pleine
                }
            }
            else {
                console.log("Le joueur avec l'ID : ".concat(playerData, " est d\u00E9j\u00E0 dans la salle : ").concat(roomId));
                socket.emit('alreadyInRoom'); // Optionnel : message personnalisé
            }
        }
        else {
            socket.emit('roomNotFound'); // Salle introuvable
        }
        console.log('players in room', room.players, room.players.length);
    });
    // Mettre à jour l'état du jeu en envoyant un événement à la machine à état
    socket.on('updateGameState', function (roomId, event) {
        console.log(roomId, event);
        var room = gameRooms[roomId];
        if (room) {
            var gameService = room.gameState;
            gameService.send(event); // Envoyer l'événement à la machine
            console.log(gameService.state.context, gameService.state.value);
            // Émettre le nouvel état à tous les joueurs de la salle
            io.to(roomId).emit('gameStateUpdated', {
                state: gameService.state.value,
                context: gameService.state.context
            });
        }
    });
    socket.on('disconnect', function () {
        console.log('Un client déconnecté :', socket.id);
    });
    // Mettre à jour l'état du jeu en envoyant un événement à la machine à état si tous les joueurs sont prêts
    socket.on('updateGameStateWithAllPlayerValidation', function (roomId, event, player) {
        console.log(roomId, event, player);
        var room = gameRooms[roomId];
        if (room) {
            var gameService = room.gameState;
            // Vérifier si le joueur est déjà dans la liste "playerReady" pour éviter les doublons
            if (!room.playerReady.includes(player)) {
                room.playerReady.push(player); // Ajouter le joueur à la liste des joueurs prêts
                console.log(player, "is ready");
            }
            // Si tous les joueurs sont prêts, envoyer l'événement à la machine
            if (room.playerReady.length === room.players.length) {
                console.log("All players are ready");
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
    socket.on('requestSubStateChange', function (roomId, nextSubState) {
        // Fonction pour mettre à jour subState et informer les clients
        var room = gameRooms[roomId];
        if (room) {
            room.subState = nextSubState;
            io.to(roomId).emit('subStateUpdated', nextSubState);
        }
    });
    socket.on('disconnect', function () {
        console.log('Un client déconnecté :', socket.id);
    });
});
// Démarrer le serveur
var PORT = process.env.PORT || 4200;
server.listen(PORT, function () {
    console.log("Serveur d\u00E9marr\u00E9 sur http://localhost:".concat(PORT));
});
