class GameTitle {
    constructor() {
        this.TAG = 'GameTitle'
    }

    create() {
        console.log(this.TAG, 'create');
        var land = this.game.add.tileSprite(0, 0, 1000, 1000, 'star-background');
        this.game.stage.backgroundColor = 0x0099cc;

        this.title = this.game.add.bitmapText(this.game.world.centerX - 200, this.game.world.centerY,  'carrier_command', `STAR.IO`, 50);
        this.play = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 100, 'carrier_command', `PLAY`, 30);
        this.play.anchor.set(0.5);

        this.play.inputEnabled = true;
        this.play.events.onInputDown.add(this.playTheGame, this);
        this.play.events.onInputOver.add(function(){
            this.game.canvas.style.cursor = "pointer";
        }, this);
        this.play.events.onInputOut.add(function(){
            this.game.canvas.style.cursor = "default";
        }, this);
        // this.gameTitle = this.game.add.sprite(this.game.height / 2, this.game.width / 2 - 200, "gametitle");
        // this.gameTitle.anchor.setTo(0.5, 0.5);
        // this.playButton = this.game.add.button(this.game.height / 2, this.game.width / 2, "play", this.playTheGame, this);
        this.play.anchor.setTo(0.5, 0.5);
    }

    playTheGame() {
        this.title.destroy();
        this.play.destroy();
        this.game.state.start("Game");
    }
}