class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload(){
    }


    create() {
        this.add.text(game.config.width/2, game.config.height/2, 'PLAY' ).setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        //create player 
        this.plrSpy = new PlayerSpy(this, 100, 50,);

        //temp floor
        this.floor = new Floor(this,200,game.config.height);
        this.physics.add.collider(this.plrSpy,this.floor);

        
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyJump)) {
            this.scene.start('menuScene');    
        }
    }

}