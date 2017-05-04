const foodDiameter = 15;
const initialWidth = 32, initialHeight = 32;
const initialX = 100, initialY = 100;
const worldBounds = {
    x: 1000,
    y: 1000
}
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xfff000, 0xff00f0, 0xff000f, 0x0099cc, 0xcc0033, 0x00cc33, 0x99e6ff,
    0x009933, 0xb3ffcc, 0x00e6ac];

class Game {
    constructor() {
        this.TAG = "Game";
        console.log(this.TAG, 'constructor');
        this.socket = io.connect(window.location.host);
        this.players = {};
    }

    preload() {
        this.game.world.setBounds(0, 0, worldBounds.x, worldBounds.y); //game world 2000 x 2000
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.cursors = this.game.cursors;

        var land = this.game.add.tileSprite(0, 0, 800, 600, 'star-background');
        land.fixedToCamera = true;

        this.generateFood();
        // this.generateEnemies();

        var player = this.generatePlayer();
        this.currentPlayer = new Player(initialX, initialY, this.socket.io.engine.id, player, this.socket);

        this.enemyGroup = this.game.add.physicsGroup();
        this.enemyGroup.collideWorldBounds = true;
        this.enemyGroup.enableBody = true;

        this.setEventHandlers();

        this.score = this.game.add.bitmapText(5, 5, 'carrier_command', `Score: ${this.currentPlayer.points}`, 20);
        this.score.fixedToCamera = true;

        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);
    }

    generatePlayer(x, y, width = initialWidth, height = initialHeight, name = "player", color, scale = 1.5) {
        x = x ? x : this.game.world.bounds.width / 2;
        y = y ? y : this.game.world.bounds.height / 2;
        color = color ? color : this.game.rnd.pick(colors);//[Math.floor((Math.random() * (colors.length + 1)))];

        var player = this.game.add.tileSprite(x, y, width, height, name);
        //enable physics
        player.enableBody = true;
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        this.game.physics.p2.enable(player);


        player.tint = color;
        player.anchor.setTo(0, 0);
        player.scale.setTo(scale);
        player.body.collideWorldBounds = true;

        return player;
    }

    generateFood() {
        this.foodGroup = this.game.add.physicsGroup();
        this.foodGroup.immovable = false;
        this.foodGroup.collideWorldBounds = true;
        this.food = {};
        for (var i = 0; i < 100; i++) {
            var f = this.game.add.graphics(Math.random() * worldBounds.x, Math.random() * worldBounds.y, this.foodGroup);
            // var f = this.game.add.graphics(150,150, this.foodGroup);
            var color = this.game.rnd.pick(colors);//[Math.floor((Math.random() * (colors.length + 1)))];
            // //draw the circle
            f.beginFill(color);
            f.drawCircle(0, 0, foodDiameter);
            f.body.collideWorldBounds = true;
            f.name = 'food' + i;
            f.id = i;
            this.food[f.id] = f;
        }
    }

    generateEnemies() {
        this.enemyGroup = this.game.add.physicsGroup();
        this.enemyGroup.collideWorldBounds = true;
        this.enemyGroup.enableBody = true;
        this.enemyGroup.immovable = true;
        for (var i = 0; i < 5; i++) {
            var enemy = this.generatePlayer(Math.random() * worldBounds.x, Math.random() * worldBounds.y, initialWidth, initialHeight,
                "player", null);
            enemy.points = 0;
            this.enemyGroup.add(enemy);
        }
    }

    update() {
        this.currentPlayer.sprite.body.velocity.x = 0;
        this.currentPlayer.sprite.body.velocity.y = 0;

        if (this.cursors.left.isDown) {
            this.currentPlayer.sprite.body.velocity.x = -150;
        }
        if (this.cursors.right.isDown) {
            this.currentPlayer.sprite.body.velocity.x = 150;
        }
        if (this.cursors.up.isDown) {
            this.currentPlayer.sprite.body.velocity.y = -150;
        }
        if (this.cursors.down.isDown) {
            this.currentPlayer.sprite.body.velocity.y = 150;
        }

        // this.currentPlayer.updatePosition();

        this.game.physics.arcade.collide(this.currentPlayer.sprite, this.foodGroup, this.onFoodCollision, null, this);
        this.game.physics.arcade.collide(this.currentPlayer.sprite, this.enemyGroup, this.onEnemyCollision, null, this);
        this.score.text = `Score: ${this.currentPlayer.points}`;

    }

    setEventHandlers() {
        this.socket.on('connect', () => {
            console.log('connect', this.currentPlayer);
            this.socket.emit('new_player', this.currentPlayer.toJson());

            this.socket.on('new_player', (enemy) => {
                console.log('new player', enemy);
                this.players[enemy.id] = new Enemy(enemy);
            });
        });
    }

    onFoodCollision(player, food) {
        this.currentPlayer.particleCollision(1);
        // this.currentPlayer.x = sprite.position.x;
        // this.currentPlayer.y = sprite.position.y;
        this.regenerateFood(food);
    }

    onEnemyCollision(player, enemy) {
        this.currentPlayer.enemyCollision(enemy);
    }

    regenerateFood(food) {
        food.body.position.x = Math.random() * worldBounds.x;
        food.body.position.y = Math.random() * worldBounds.y;
        // food.moveTo(Math.random() * 100 + 1, Math.random() * 100 + 1);
        food.body.velocity.x = 0;
        food.body.velocity.y = 0;
    }

    render() {
        // this.game.debug.cameraInfo(this.game.camera, 16, 150);
        // this.game.debug.spriteInfo(this.currentPlayer.sprite, 16, 150);
        // this.game.debug.bodyInfo(this.food[0], 16, 24);
    }

}