class Player {

    constructor(x, y, id, body, socket) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.sprite = body;
        this.points = 0;
        this.alive = true;
        this.socket = socket ? socket : {};
    };

    // updatePosition(x, y) {
    //     this.x = x;
    //     this.y = y;
    // }

    kill() {
        this.sprite.kill();
    }

    particleCollision(points) {
        this.points += points;
        this.sprite.scale.x += 0.01 * points;
        this.sprite.scale.y += 0.01 * points;
    }

    enemyCollision(enemy) {
        if (0.9 * this.points >= enemy.points) {
            this.points += enemy.points;
            this.sprite.scale.x += 0.01 * enemy.points;
            this.sprite.scale.y += 0.01 * enemy.points;
            //kill the other guy
            // var enemy = {
            //     id: enemy.id,
            //     velocity: enemy.speed,
            //     tint: enemy.tint,
            //     position: enemy.position,
            //     height: enemy.height,
            //     width: enemy.width,
            //     scale: enemy.scale
            // };
            this.socket.emit('kill_player', enemy);
        } else if (0.9 * enemy.points >= this.points) {
            this.kill();
            this.socket.emit('kill_player', this.toJson());
            //kill you
            enemy.sprite.kill();
            this.socket.emit('kill_player', enemy);
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
