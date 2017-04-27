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
    }

    preload() {
        this.game.world.setBounds(0, 0, worldBounds.x, worldBounds.y); //game world 2000 x 2000
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.cursors = this.game.cursors;

        var land = this.game.add.tileSprite(0, 0, 800, 600, 'star-background');
        land.fixedToCamera = true;

        this.generateFood();

        var player = this.generatePlayer();
        this.currentPlayer = new Player(initialX, initialY, 1, player);
        this.score = this.game.add.bitmapText(5, 5, 'carrier_command', `Score: ${this.currentPlayer.points}`, 20);
        this.score.fixedToCamera = true;

        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);

    }

    generatePlayer() {
        var player = this.game.add.tileSprite(this.game.world.bounds.width / 2, this.game.world.bounds.height / 2, initialWidth, initialHeight, "player");
        //enable physics
        player.enableBody = true;
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        this.game.physics.p2.enable(player);


        var color = this.game.rnd.pick(colors);//[Math.floor((Math.random() * (colors.length + 1)))];
        player.tint = color;
        player.anchor.setTo(0, 0);
        player.scale.setTo(1.5);
        player.body.collideWorldBounds = true;

        return player;
    }

    generateFood() {
        // this.foodGroup = this.game.add.group();
        this.foodGroup = this.game.add.physicsGroup();
        this.foodGroup.immovable = false;
        this.foodGroup.collideWorldBounds = true;
        this.food = [];
        for (var i = 0; i < 100; i++) {
            var f = this.game.add.graphics(Math.random() * worldBounds.x, Math.random() * worldBounds.y, this.foodGroup);
            // var f = this.game.add.graphics(150,150, this.foodGroup);
            var color = this.game.rnd.pick(colors);//[Math.floor((Math.random() * (colors.length + 1)))];
            // //draw the circle
            f.beginFill(color);
            f.drawCircle(0, 0, foodDiameter);
            f.endFill();
            f.body.collideWorldBounds = true;
            f.name = 'food' + i;
            this.food.push(f);
        }
    }

    update() {
        this.currentPlayer.player.body.velocity.x = 0;
        this.currentPlayer.player.body.velocity.y = 0;

        if (this.cursors.left.isDown) {
            this.currentPlayer.player.body.velocity.x = -150;
        } else if (this.cursors.right.isDown) {
            this.currentPlayer.player.body.velocity.x = 150;
        } else if (this.cursors.up.isDown) {
            this.currentPlayer.player.body.velocity.y = -150;
        } else if (this.cursors.down.isDown) {
            this.currentPlayer.player.body.velocity.y = 150;
        }

        var hitEnemy = this.game.physics.arcade.collide(this.currentPlayer.player, this.foodGroup, this.onCollision, null, this);
        this.score.text = `Score: ${this.currentPlayer.points}`;
    }

    onCollision(player, food) {
        this.currentPlayer.points++;
        this.currentPlayer.player.scale.x+=0.01;
        this.currentPlayer.player.scale.y+=0.01;
        this.currentPlayer.x = player.position.x;
        this.currentPlayer.y = player.position.y;
        this.regenerateFood(food);
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
        // this.game.debug.spriteInfo(this.currentPlayer.player, 16, 150);
        // this.game.debug.bodyInfo(this.food[0], 16, 24);
    }

}