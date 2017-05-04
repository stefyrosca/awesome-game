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
        console.log('update position', this.enemy.x, this.enemy.y, x, y)
        this.enemy.x = x;
        this.enemy.y = y;
    }

}