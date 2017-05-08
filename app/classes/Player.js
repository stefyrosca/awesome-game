class Player {

    constructor(x, y, id, body, socket) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.sprite = body;
        this.points = 0;
        this.alive = true;
        this.lastId = null;
        this.socket = socket ? socket : {};
    };

    // updatePosition(x, y) {
    //     this.x = x;
    //     this.y = y;
    // }

    kill() {
        console.log('GAME OVER')
        this.sprite.kill();
    }

    particleCollision(food) {
        if (this.lastId == food.id)
            return;
        if (!food.alive)
            return;
        this.points += food.points ? food.points : 1;
        this.sprite.scale.x += 0.01 * food.points;
        this.sprite.scale.y += 0.01 * food.points;
        this.lastId = food.id;
    }

    enemyCollision(enemy) {
        if (0.9 * this.points >= enemy.points) {
            console.log('you won!!');
            this.points += enemy.points;
            this.sprite.scale.x += 0.01 * enemy.points;
            this.sprite.scale.y += 0.01 * enemy.points;
            //kill the other guy
            var enemyJson = {
                id: enemy.id,
                velocity: enemy.body.velocity,
                tint: enemy.tint,
                position: enemy.position,
                height: enemy.height,
                width: enemy.width,
                scale: enemy.scale
            };
            console.log('kill the enemy', enemyJson.id);
            this.socket.emit('remove_player', JSON.stringify(enemyJson));
        } else if (0.9 * enemy.points >= this.points) {
            console.log('you lost!!');
            //kill you
            this.kill();
            this.socket.emit('remove_player', JSON.stringify(this.toJson()));
        }
    }

    createFromJson(player, sprite) {
        this.x = player.position.x;
        this.y = player.position.y;
        this.points = player.points;
        this.id = player.id;
        this.sprite = sprite ? sprite : null;
        this.tint = player.tint;
        this.scale = player.scale;
        this.width = player.width;
        this.height = player.height;
        this.velocity = player.velocity;
    }

    toJson() {
        return {
            position: this.sprite.position,
            points: this.points,
            id: this.id,
            tint: this.sprite.tint,
            scale: this.sprite.scale,
            width: this.sprite.width,
            height: this.sprite.height,
            velocity: this.sprite.body.velocity
        };
    }
}
