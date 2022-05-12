class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload(){
    }


    create() {
        this.add.text(game.config.width/2, game.config.height/2, 'PLAY' ).setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        
        //defining keys 
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyDisguise = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        //create player 
        this.plrSpy = new PlayerSpy(this, 100, 50);
        
        //temp detection
        this.detection = new LOS(this, 100,50, 'circle', 10 );

        //temp floor
        this.floor = new Floor(this,200,game.config.height);
        this.physics.add.collider(this.plrSpy,this.floor);
        //moving text 
        this.dressedText = this.add.text(game.config.width/2 + 600, game.config.height/2, 'Getting dressed...',{fontSize: '9px'} ).setOrigin(0.5);

        //colliders
         this.physics.add.overlap(this.plrSpy, this.detection, this.detected, null, this);
         this.gameOver = false;
    }

    update(time, delta ) {
        if(!this.gameOver){
            this.plrSpy.update(time, delta);
        }

        //allows text to follow player while getting dressed 
        if(this.plrSpy.gettingDressed){
            this.dressedText.x = this.plrSpy.x +10;
            this.dressedText.y = this.plrSpy.y - 30;
        }
        if(this.plrSpy.detected && !this.gameOver){
            this.plrSpy.detected = false;
        }
    }

    detected(plrObj, detectedObj){
        plrObj.detected = true;
    }

}