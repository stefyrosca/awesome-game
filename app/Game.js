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
        this.socket = io.connect("http://localhost:3000");
    }

    preload() {
        this.players = {};
        this.food = {};

        this.game.world.setBounds(0, 0, worldBounds.x, worldBounds.y); //game world 2000 x 2000
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.cursors = this.game.cursors;

        var land = this.game.add.tileSprite(0, 0, 1600, 1200, 'star-background');
        land.fixedToCamera = true;

        this.enemyGroup = this.game.add.physicsGroup();
        this.enemyGroup.collideWorldBounds = true;
        this.enemyGroup.enableBody = true;

        this.foodGroup = this.game.add.physicsGroup();
        this.foodGroup.immovable = false;
        this.foodGroup.collideWorldBounds = true;

        var player = this.generatePlayer();
        this.currentPlayer = new Player(initialX, initialY, this.socket.io.engine.id, player, this.socket);


        this.setEventHandlers();
        // this.generateFood();

        this.score = this.game.add.bitmapText(5, 5, 'carrier_command', `Score: ${this.currentPlayer.points}`, 20);
        this.score.fixedToCamera = true;

        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);
    }

    generatePlayer(x, y, width = initialWidth, height = initialHeight, name = "player", color, scale = {
        x: 1.5,
        y: 1.5
    }) {
        x = x ? x : this.game.world.bounds.width / 2;
        y = y ? y : this.game.world.bounds.height / 2;
        color = color ? color : this.game.rnd.pick(colors);//[Math.floor((Math.random() * (colors.length + 1)))];

        var player = this.game.add.tileSprite(x, y, 32, 32, name);
        //enable physics
        player.enableBody = true;
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.foodGroup, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.enemyGroup, Phaser.Physics.ARCADE);


        player.tint = color;
        player.anchor.setTo(0, 0);
        player.scale.setTo(scale.x, scale.y);
        player.body.collideWorldBounds = true;

        return player;
    }

    addFood(food) {
        var f = this.game.add.graphics(food.x, food.y, this.foodGroup);
        f.beginFill(food.color);
        f.drawCircle(0, 0, food.diameter);
        f.body.collideWorldBounds = true;
        f.name = food.name;
        f.id = food.id;
        f.points = food.points;
        this.food[f.id] = f;
    }

    updateFood(food) {
        var f = this.food[food.id];

        f.body.position.x = food.x;
        f.body.position.y = food.y;
        f.x = food.x;
        f.y = food.y;
        f.body.velocity.x = 0;
        f.body.velocity.y = 0;
        f.revive();
    }

    update() {
        this.currentPlayer.sprite.body.velocity.x = 0;
        this.currentPlayer.sprite.body.velocity.y = 0;

        var oldPosition = {x: this.currentPlayer.sprite.position.x, y: this.currentPlayer.sprite.position.y};
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

        var newPosition = this.currentPlayer.sprite.body.position;

        if (oldPosition.x != newPosition.x || oldPosition.y != newPosition.y) {
            this.socket.emit("move_player", JSON.stringify(newPosition));
            if (!newPosition || !newPosition.x || !newPosition.y)
                console.log('bad position:(!!', this.currentPlayer.sprite)
        }

        // this.currentPlayer.updatePosition();

        this.game.physics.arcade.collide(this.currentPlayer.sprite, this.foodGroup, this.onFoodCollision, null, this);
        this.game.physics.arcade.collide(this.currentPlayer.sprite, this.enemyGroup, this.onEnemyCollision, null, this);
        this.score.text = `Score: ${this.currentPlayer.points}`;

    }

    setEventHandlers() {
        this.socket.emit('new_player', JSON.stringify(this.currentPlayer.toJson()));

        this.socket.on('new_player', (enemy) => {
            if (enemy.id !== this.currentPlayer.id) {
                var generatedEnemy =
                    this.generatePlayer(enemy.position.x, enemy.position.y, enemy.width, enemy.height, "player", enemy.tint, enemy.scale);
                generatedEnemy.points = enemy.points;
                generatedEnemy.id = enemy.id;
                this.enemyGroup.add(generatedEnemy);
                this.players[enemy.id] = new Enemy(generatedEnemy);
            }
        });

        this.socket.on('move_player', (enemy) => {
            if (enemy.id !== this.currentPlayer.id) {
                this.players[enemy.id] && this.players[enemy.id].updatePosition(enemy.position.x, enemy.position.y);
            }
        });

        this.socket.on('new_food', (food) => {
            this.addFood(food);
        });

        this.socket.on('update_food', (food) => {
            this.addFood(food);
            // this.updateFood(food);
        });

        this.socket.on('update_player', enemy => {
            if (enemy.id !== this.currentPlayer.id) {
                this.players[enemy.id] && this.players[enemy.id].updatePlayer(enemy);
            }
        });

        this.socket.on('remove_player', (player) => {
            console.log('remove_player', player)
            if (player.id == this.currentPlayer.id) {
                console.log('I DIED :(');
                this.currentPlayer.sprite.destroy();
                Object.keys(this.players).forEach(id => {
                    if (id == this.currentPlayer.id)
                        return;
                    this.players[id].remove()
                    delete this.players[id];
                });
                Object.keys(this.food).forEach(id => {
                    this.food[id].destroy()
                    delete this.food[id];
                });
                // this.socket.disconnect();
                this.game.state.start("GameOver");
                return;
            }
            var removePlayer = this.players[player.id];
            if (removePlayer) {
                removePlayer.remove();
                delete this.players[player.id];
            }
        });
    }

    onFoodCollision(player, food) {
        if (!food.alive)
            return;
        this.currentPlayer.particleCollision(food);
        food.destroy();
        this.food[food.id] = food;
        // this.currentPlayer.x = sprite.position.x;
        // this.currentPlayer.y = sprite.position.y;
        // this.regenerateFood(food);
        this.socket.emit('update_player', JSON.stringify(this.currentPlayer.toJson()));
        var foodJson = {id: food.id};
        this.socket.emit('eat_food', JSON.stringify(foodJson));
    }

    onEnemyCollision(player, enemy) {
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
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
        this.game.debug.bodyInfo(this.currentPlayer.sprite, 16, 150);
        // this.game.debug.bodyInfo(this.food[0], 16, 24);
    }

}