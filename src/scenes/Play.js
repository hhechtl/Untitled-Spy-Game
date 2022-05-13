class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload(){
    }


    create() {
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        
        //defining keys 
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyDisguise = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        //create player 
        this.plrSpy = new PlayerSpy(this, 100, 50);
        
        // group of detectors
        // if player i caught in one game ends
        this.groupDetectors = this.physics.add.group();
        this.groupDetectors.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupDetectors.runChildUpdate = true;
        
        // temp detector
        //this.groupDetectors.add(new LOS(this, 200,100));


        //temp floor
        this.floor = new Floor(this,200,game.config.height);
        this.physics.add.collider(this.plrSpy,this.floor);
        //moving text 
        this.dressedText = this.add.text(game.config.width/2 + 600, game.config.height/2, 'Getting dressed...',{fontSize: '9px'} ).setOrigin(0.5);

        //colliders
         this.physics.add.overlap(this.plrSpy, this.groupDetectors, this.detected, null, this);
         this.gameOver = false;
    }

    update(time, delta ) {
        if(!this.gameOver){
            this.plrSpy.update(time, delta);
        }
        if(this.gameOver){
            this.add.text(game.config.width/2, game.config.height/2, 'GAMEOVER' ).setOrigin(0.5);
        }
        //allows text to follow player while getting dressed 
        if(this.plrSpy.gettingDressed){
            this.dressedText.x = this.plrSpy.x +10;
            this.dressedText.y = this.plrSpy.y - 30;
        }
    }

    detected(plrObj, detectedObj){
        plrObj.detected = true;
        this.gameOver = true;
    }

}