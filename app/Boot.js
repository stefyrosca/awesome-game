class Boot {

    constructor() {
        this.TAG = 'Boot';
        console.log(this.TAG, 'constructor')
    }
    init() {
        console.log(this.TAG, 'init')
    }
    preload() {
        console.log(this.TAG, 'preload');
        this.game.load.image('loading', 'app/assets/loading.gif');
    }
    create(){
        console.log(this.TAG, 'create');
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.game.state.start('Preload');
    }

}