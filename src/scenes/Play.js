class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    create() {
        this.add.text(game.config.width/2, game.config.height/2, 'PLAY' ).setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyJump)) {
            this.scene.start('menuScene');    
        }
    }

}