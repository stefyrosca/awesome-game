var Player = function (x, y, id, body) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.player = body;

    this.points = 20;

};

Player.prototype.update = function () {
    this.player.play('move')
    // this.body.rotation = Math.PI + game.physics.arcade.angleToXY(this.currentPlayer, this.lastPosition.x, this.lastPosition.y)
}