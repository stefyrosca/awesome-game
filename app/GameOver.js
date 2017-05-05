class GameOver {
    constructor(args) {
        this.TAG = 'GameOver';
    }

    create() {
        var land = this.game.add.tileSprite(0, 0, 1000, 1000, 'star-background');
        this.gameOver = this.game.add.bitmapText(this.game.world.centerX - 350, this.game.world.centerY / 2,  'carrier_command', `GAME OVER`, 50);
        this.play = this.game.add.bitmapText(this.game.world.centerX - 100, this.game.world.centerY / 2 + 100, 'carrier_command', `PLAY AGAIN`, 30);
        this.play.anchor.set(0.5);

        this.play.inputEnabled = true;
        this.play.events.onInputDown.add(this.playTheGame, this);
        this.play.events.onInputOver.add(function(){
            this.game.canvas.style.cursor = "pointer";
        }, this);
        this.play.events.onInputOut.add(function(){
            this.game.canvas.style.cursor = "default";
        }, this);
    }

    playTheGame() {
        this.gameOver.destroy();
        this.play.destroy();
        this.game.state.start("Game");
    }
}