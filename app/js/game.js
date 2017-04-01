const foodDiameter = 15;
const initialWidth = 32, initialHeight = 32;
const initialX = 100, initialY = 100;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xfff000, 0xff00f0, 0xff000f];

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
var currentPlayer;
var foodGroup, cursors;

function preload() {
    game.load.image('background', 'js/assets/background.png')
    game.load.image('player', 'js/assets/star.png')
}

function create() {
    console.log('create game');
    game.world.setBounds(-500, -500, 1000, 1000); //game world 2000 x 2000
    game.physics.startSystem(Phaser.Physics.P2JS);
    // game.camera.bounds.setTo(-game.width / 2, -game.height / 2, game.world.width + game.width, game.world.height + game.height);

    cursors = game.input.keyboard.createCursorKeys();

    var land = game.add.tileSprite(0, 0, 800, 600, 'background');
    land.fixedToCamera = true;

    // create group for foodGroup
    generateFood();
    // create player
    var player = generatePlayer();
    currentPlayer = new Player(initialX, initialY, 1, player);

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);
}

function generatePlayer() {
    var player = game.add.tileSprite(game.world.centerX, game.world.centerY, initialWidth, initialHeight, "player");
    //enable physics
    player.enableBody = true;
    game.physics.enable(player, Phaser.Physics.ARCADE);
    game.physics.p2.enable(player);


    var color = colors[Math.floor((Math.random() * (colors.length + 1)))];
    player.tint = color;
    player.scale.setTo(1.5);
    player.anchor.setTo(0.5, 0.5);
    player.body.collideWorldBounds = true;

    return player;
}

function generateFood() {
    foodGroup = game.add.group();
    foodGroup.immovable = true;
    foodGroup.enableBody = true;
    var f = game.add.graphics(100, 100, foodGroup);
    color = colors[Math.floor((Math.random() * (colors.length + 1)))];
    // //draw the circle
    f.beginFill(color);
    f.drawCircle(f.x, f.y, foodDiameter);
    f.endFill();
    f.body.immovable = true;
}

function update() {
    currentPlayer.player.body.velocity.x = 0;
    currentPlayer.player.body.velocity.y = 0;

    if (cursors.left.isDown) {
        currentPlayer.player.body.velocity.x = -150;
    } else if (cursors.right.isDown) {
        currentPlayer.player.body.velocity.x = 150;
    } else if (cursors.up.isDown) {
        currentPlayer.player.body.velocity.y = -150;
    } else if (cursors.down.isDown) {
        currentPlayer.player.body.velocity.y = 150;
    }

    var hitEnemy = game.physics.arcade.collide(currentPlayer.player, foodGroup);
    // if (hitEnemy)
    game.physics.arcade.overlap(currentPlayer.player, foodGroup, this.touchEnemy, this.extraCallback, this);
}

update.prototype.extraCallback = function (player, enemy) {
    console.log('extraCallback', player, enemy);
    return false;
}

update.prototype.touchEnemy = function (player, enemy) {
    console.log('touchEnemy');
    console.log('player', player);
    console.log('enemy', enemy);
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
}