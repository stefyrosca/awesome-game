class Enemy {
    constructor(enemy) {
        console.log('enemy', enemy);
        this.enemy = enemy;
        // this.x = x;
        // this.y = y;
        // this.points = points;
        // this.sprite = player;
    }

    updatePosition(x, y) {
        this.enemy.position.x = x;
        this.enemy.position.y = y;
    }

    updatePlayer(player) {
        this.enemy = Object.assign(this.enemy, player);
    }

    remove() {
        this.enemy.destroy();
    }

}