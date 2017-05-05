var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(client){
    client.on('new_player', (player)=>onNewPlayer(client, player));
    client.on('move_player', (position)=>onMovePlayer(client, position));
    client.on('update_player', (scale)=>onUpdatePlayer(client, scale));
    client.on('remove_player', (player)=>onKillPlayer(client, player));
    client.on('disconnect', ()=>onRemovePlayer(client));
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
const onRemovePlayer = client => {
    console.log(`removing player: ${client.id}`);
    const removePlayer = players[client.id];
    if (!removePlayer) {
        console.log(`player not found: ${client.id}`);
        return;
    }
    delete players[client.id];
    io.emit('remove_player', removePlayer);
};
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

function onUpdatePlayer(ioClient, player) {
    let oldPlayer = players[ioClient.id];
    if (!oldPlayer) {
        console.log(`player not found: ${ioClient.id}`);
        return;
    }
    console.log('updatePlayer', player);
    players[ioClient.id] = JSON.parse(player);
    io.emit('update_player', players[ioClient.id]);
}

function onMovePlayer(ioClient, position) {
    console.log('players', players);
    let player = players[ioClient.id];
    if (!player) {
        console.log(`player not found: ${ioClient.id}`);
        return;
    }
    player.position = JSON.parse(position);
    io.emit('move_player', player);
}

function onKillPlayer(ioClient, player) {
    console.log('remove! player', player);
    let killedPlayer = players[player.id];
    if (!killedPlayer) {
        console.log(`player not found: ${player.id}`);
        return;
    }
    delete players[player.id];
    io.emit('remove_player', killedPlayer);
}
