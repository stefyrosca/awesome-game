var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(client){
    client.on('new_player', (player)=>onNewPlayer(client, player));
    client.on('move_player', (player)=>onMovePlayer(client, player));
    client.on('disconnect', function(){});
});
server.listen(3000);

class Player {
    constructor() {}
    createFromJson(player, sprite) {
        this.position = player.position;
        this.points = player.points;
        this.id = player.id;
        this.tint = player.tint;
        this.scale = player.scale;
        this.width = player.width;
        this.height = player.height;
        this.velocity = player.velocity;
    }
}

// let io;

// const server = http.createServer(ecstatic({root: path.resolve(__dirname, '../')}))
//     .listen(3000, () => {
//         io = socketIo.listen(server);
//         io.on('connect', client => {
//             client.on('disconnect', () => onRemovePlayer(client));
//             client.on('new_player', (player) => onNewPlayer(client, player))
//             client.on('move player', (player) => onMovePlayer(client, player));
//         })
//     });
//
const players = {};
//
// const onRemovePlayer = client => {
//     log(`removing player: ${client.id}`);
//     const removePlayer = players[client.id];
//     if (!removePlayer) {
//         log(`player not found: ${client.id}`);
//         return;
//     }
//     delete players[client.id];
//     io.emit('remove currentPlayer', removePlayer);
// };
//
const onNewPlayer = (ioClient, player) => {
    console.log(`new player: ${ioClient.id}`);
    let newPlayer = new Player();
    newPlayer.createFromJson(JSON.parse(player));
    newPlayer.id = ioClient.id;
    io.emit('new_player', newPlayer);
    Object.getOwnPropertyNames(players).forEach(id => ioClient.emit('new_player', players[id]));
    players[newPlayer.id] = newPlayer;
}

function onMovePlayer(ioClient, position) {
    console.log('move platyer', position)
    let movePlayer = players[ioClient.id];
    if (!movePlayer) {
        log(`player not found: ${ioClient.id}`);
        return;
    }
    movePlayer.position = JSON.parse(position);
    io.emit('move_player', movePlayer);
}
