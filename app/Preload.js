class Preload {
    constructor() {
        this.TAG = "Preload";
        console.log(this.TAG, 'constructor');
    }

    preload() {
        console.log(this.TAG, 'preload');
        var loading = this.add.sprite(200, 240, 'loading');
        this.load.setPreloadSprite(loading);
        this.game.load.image('background', 'app/assets/background.png');
        this.game.load.image('star-background', 'app/assets/star-background.jpg');
        this.game.load.image('player', 'app/assets/star.png');
        this.game.load.image('gametitle', 'app/assets/gametitle.png');
        this.game.load.image('play', 'app/assets/play.png');
        this.game.load.bitmapFont('carrier_command', 'app/assets/fonts/carrier_command.png', 'app/assets/fonts/carrier_command.xml');
        //TODO: load ALL photos and logic
        // this.game.world.setBounds(-500, -500, 1000, 1000); //game world 2000 x 2000
        // this.game.physics.startSystem(Phaser.Physics.P2JS);
        // game.camera.bounds.setTo(-game.width / 2, -game.height / 2, game.world.width + game.width, game.world.height + game.height);

        this.game.cursors = this.game.input.keyboard.createCursorKeys();
    }

    create() {
        console.log(this.TAG, 'create');
        this.game.state.start('GameTitle', true);
    }



}