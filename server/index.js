const log = console.log;
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

let io;

const server = http.createServer()
    .listen(3000, () => {
        io = socketIo.listen(server);
        io.on('connection', client => {
            client.on('disconnect', () => onRemovePlayer(client));
            client.on('new currentPlayer', (player) => onNewPlayer(client, player))
            client.on('move currentPlayer', (player) => onMovePlayer(client, player));
        })
    });

class Player {
    constructor(startX, startY, startAngle) {
        this.x = startX;
        this.y = startY;
        this.angle = startAngle;
    }
}

const players = {};

const onRemovePlayer = client => {
    log(`removing player: ${client.id}`);
    const removePlayer = players[client.id];
    if (!removePlayer) {
        log(`player not found: ${client.id}`);
        return;
    }
    delete players[client.id];
    io.emit('remove currentPlayer', removePlayer);
};

const onNewPlayer = (ioClient, player) => {
    log(`new player: ${ioClient.id}`);
    console.log('new currentPlayer', player);
    const newPlayer = new Player(player.x, player.y, player.angle);
    newPlayer.id = ioClient.id
    io.emit('new currentPlayer', newPlayer);
    Object.getOwnPropertyNames(players).forEach(id => ioClient.emit('new currentPlayer', players[id]));
    players[newPlayer.id] = newPlayer;
}

function onMovePlayer(ioClient, player) {
    log(`moving player: ${ioClient.id}`);
    const movePlayer = players[ioClient.id];
    if (!movePlayer) {
        log(`player not found: ${ioClient.id}`);
        return;
    }
    Object.assign(movePlayer, player);
    io.emit('move currentPlayer', movePlayer);
}
