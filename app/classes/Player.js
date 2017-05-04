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
        if (enemy.sprite.alive && 0.9 * this.points >= enemy.points) {
            this.points += enemy.points;
            this.sprite.scale.x += 0.01 * enemy.points;
            this.sprite.scale.y += 0.01 * enemy.points;
            //kill the other guy
            var enemy = {
                id: enemy.sprite.id,
                speed: enemy.sprite.speed,
                color: enemy.sprite.color,
                x: enemy.sprite.x,
                y: enemy.sprite.y,
                height: enemy.sprite.height,
                width: enemy.sprite.width
            };
            enemy.sprite.kill();
            this.socket.emit('kill_player', enemy);
        } else if (enemy.sprite.alive && 0.9 * enemy.points >= this.points) {
            this.kill();
            this.socket.emit('kill_player', this.toJson());
            //kill you
            enemy.sprite.kill();
            this.socket.emit('kill_player', enemy);
        }
    }

    toJson() {
        return {
            x: this.sprite.position.x,
            y: this.sprite.position.y,
            points: this.points,
            id: this.id,
            sprite: this.sprite
        }
    }
}
