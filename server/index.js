var server = require('http').createServer();
var io = require('socket.io')(server);
const worldBounds = {
    x: 1000,
    y: 1000
}
const foodDiameter = 15;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xfff000, 0xff00f0, 0xff000f, 0x0099cc, 0xcc0033, 0x00cc33, 0x99e6ff,
    0x009933, 0xb3ffcc, 0x00e6ac];


const players = {};
const foods = {};

generateFood();

io.on('connection', function(client){
    client.on('new_player', (player)=>onNewPlayer(client, player));
    client.on('move_player', (position)=>onMovePlayer(client, position));
    client.on('update_player', (scale)=>onUpdatePlayer(client, scale));
    client.on('eat_food', (food)=>onUpdateFood(client, food));
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
    Object.getOwnPropertyNames(foods).forEach(id => ioClient.emit('new_food', foods[id]));
    players[newPlayer.id] = newPlayer;
}

function onUpdatePlayer(ioClient, player) {
    let oldPlayer = players[ioClient.id];
    if (!oldPlayer) {
        console.log(`player not found: ${ioClient.id}`);
        return;
    }
    players[ioClient.id] = JSON.parse(player);
    io.emit('update_player', players[ioClient.id]);
}

function onUpdateFood(ioClient, food) {
    var x =  Math.random() * worldBounds.x;
    var y =  Math.random() * worldBounds.y;
    var newFood = JSON.parse(food);
    newFood = Object.assign(newFood, foods[newFood.id])
    newFood.x = x;
    newFood.y = y;
    foods[newFood.id] = newFood;
    io.emit('update_food', newFood);
}

function onMovePlayer(ioClient, position) {
    let player = players[ioClient.id];
    if (!player) {
        console.log(`player not found: ${ioClient.id}`);
        return;
    }
    player.position = JSON.parse(position);
    io.emit('move_player', player);
}

function onKillPlayer(ioClient, player) {
    player = JSON.parse(player);
    let killedPlayer = players[player.id];
    if (!killedPlayer) {
        console.log(`player not found: ${player.id}`);
        return;
    }
    delete players[player.id];
    io.emit('remove_player', killedPlayer);
}

function generateFood() {
    for (var i = 0; i < 50; i++) {
        var x = Math.random() * worldBounds.x;
        var y = Math.random() * worldBounds.y;
        var color = colors[Math.floor((Math.random() * (colors.length + 1)))];
        // //draw the circle
        var name = 'food' + i;
        var id = i;
        foods[id] = _generate(x, y, color, name, id, foodDiameter, 1);
    }
}

function _generate(x, y, color, name, id, diameter, points) {
    return {x, y, color, name, id, diameter, points};
}