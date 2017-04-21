class GameTitle {
    constructor() {
        this.TAG = 'GameTitle'
    }

    create() {
        console.log(this.TAG, 'create');
        var land = this.game.add.tileSprite(0, 0, 800, 600, 'background');
        this.gameTitle = this.game.add.sprite(200, 160, "gametitle");
        this.gameTitle.anchor.setTo(0.5, 0.5);
        this.playButton = this.game.add.button(200, 320, "play", this.playTheGame, this);
        this.playButton.anchor.setTo(0.5, 0.5);
    }

    playTheGame() {
        console.log('clicked !!');
        // this.gameTitle.destroy();
        // this.playButton.destroy();
        // this.game.state.start("TheGame");
    }
}