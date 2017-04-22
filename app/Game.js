const foodDiameter = 15;
const initialWidth = 32, initialHeight = 32;
const initialX = 100, initialY = 100;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xfff000, 0xff00f0, 0xff000f];

class Game {
    constructor() {
        this.TAG = "Game";
        console.log(this.TAG, 'constructor');
    }

    preload() {
        this.game.world.setBounds(-500, -500, 1000, 1000); //game world 2000 x 2000
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        var land = this.game.add.tileSprite(0, 0, 800, 600, 'background');
        land.fixedToCamera = true;

        this.generateFood();

        var player = this.generatePlayer();
        this.currentPlayer = new Player(initialX, initialY, 1, player);

        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);
        console.log('GAME!!', this.game);
        console.log(this.currentPlayer)

    }

    generatePlayer() {
        var player = this.game.add.tileSprite(this.game.world.centerX, this.game.world.centerY, initialWidth, initialHeight, "player");
        //enable physics
        player.enableBody = true;
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        this.game.physics.p2.enable(player);


        var color = colors[Math.floor((Math.random() * (colors.length + 1)))];
        player.tint = color;
        player.scale.setTo(1.5);
        player.anchor.setTo(0.5, 0.5);
        player.body.collideWorldBounds = true;

        return player;
    }

    generateFood() {
        // this.foodGroup = this.game.add.group();
        this.foodGroup = this.game.add.physicsGroup();
        this.foodGroup.immovable = false;
        this.foodGroup.collideWorldBounds = true;
        this.food = [];
        for (var i = 0; i < 2; i++) {
            var f = this.game.add.graphics(Math.random() * 100 + 1, Math.random() * 100 + 1, this.foodGroup);
            var color = colors[Math.floor((Math.random() * (colors.length + 1)))];
            // //draw the circle
            f.beginFill(color);
            f.drawCircle(f.x, f.y, foodDiameter);
            f.endFill();
            f.body.collideWorldBounds = true;
            f.name = 'food' + i;
            this.food.push(f);
        }
        console.log('food', this.food);
        console.log('food group', this.foodGroup);
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
        if (hitEnemy) {
            // console.log('HIT!!')
            // console.log(hitEnemy)
        }
        // game.physics.arcade.overlap(this.currentPlayer.player, this.foodGroup, this.touchEnemy, this.extraCallback, this);
    }

    onCollision(player, food) {
        // this.reanimateFood(food);
        // console.log('this', this);
        console.log('food', food);
        this.regenerateFood(food);
        console.log('food', food);
    }

    regenerateFood(food) {
        food.body.position.x = Math.random() * 100 + 1;
        food.body.position.y = Math.random() * 100 + 1;
        // food.moveTo(Math.random() * 100 + 1, Math.random() * 100 + 1);
        food.body.velocity.x = 0;
        food.body.velocity.y = 0;
    }

    render() {
        // this.game.debug.cameraInfo(this.game.camera, 16, 150);
        this.game.debug.spriteInfo(this.currentPlayer.player, 16, 150);
        this.game.debug.bodyInfo(this.food[0], 16, 24);
    }

}