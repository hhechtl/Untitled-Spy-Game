class PlayerSpy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        //These have to be first for physics stuff to work
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        
        //needs to be tweaked when assets are loaded
        this.setCircle(10); //Testing collision box resizing/changing

        //player variables 
        this.disguiseActive = false;
        this.gettingDressed = false; 
        this.detected = false;

        this.tempUI = false; // remove later 
        

        //needs to be tweaked 
        this.normalMoveSpeed = 500; //Horizontal acceleration
        this.slowedMoveSpeed = 150; //Slow (disguising) acceleration
        this.setMaxVelocity(250,1000); // max velocity 
        this.setDragX(600);
        this.jumpPower = -300;
        this.jumpTime = 1;

        // remove later, for testing
        this.setCollideWorldBounds(true);

        
    }

    update(time, delta){
        /* Converts delta from milliseconds to seconds. For me it's easier
        to read, but might not match up with how physics object uses delta.
        Let me know if physics seems weird
        - Santiago */
        delta /= 1000
        //Horizontal movement
        if(keyLeft.isDown && this.x > 0 ){  //player will move slower when disguise is active
            this.gettingDressed ? this.setAccelerationX(-this.slowedMoveSpeed) : this.setAccelerationX(-this.normalMoveSpeed);
    
        }
        else if(keyRight.isDown && this.x < config.width){
            this.gettingDressed ? this.setAccelerationX(this.slowedMoveSpeed) : this.setAccelerationX(this.normalMoveSpeed);
        }
        else{
            //player stops moving when not holding key
            this.setAccelerationX(0);
        }
        
        //jumping 
        // how to implement it was looked from here.
        //http://floss.booktype.pro/learn-javascript-with-phaser/game-mechanic-longer-jumps-if-holding-jump-down/
        if(!this.gettingDressed){ // player can only jump when not gettig dressed
            if(keyJump.isDown && !keyDown.isDown){
                if(this.body.onFloor() && this.jumpTime == 0){
                    this.scene.sound.play('sfx_jump');
                    // starts the jump
                    this.jumpTime = 1;
                    this.setVelocityY(this.jumpPower);
                }else if (this.jumpTime > 0 && this.jumpTime < 20){ // can shorten jump time 
                    // this lets the player jump higher
                    this.jumpTime++;
                    this.setVelocityY(this.jumpPower+(this.jumpTime * 5)); // how much higher you jump
                }
            }
            else{
                //reset jump timer when it's not being pressed
                this.jumpTime = 0;
            }
        }

        //applying disguise
        if( (keyDisguise.getDuration() >= 5*1000) && !this.disguiseActive){
            this.disguiseOn(); 
            // timer on how long the disguise is active
            this.scene.sound.play('sfx_disguise');
            this.active = this.scene.time.addEvent({ delay: 10000, callback: () =>{
                console.log("its off");
                this.disguiseOff()
                this.tempUI = false;
                this.scene.dressedText.x = this.y - 300; // remove later
                this.scene.dressedText.text = "Getting Dressed..."; //remove later 
            } });
        }else if( keyDisguise.getDuration() != 0 && (keyDisguise.getDuration() <= 5*1000) && !this.disguiseActive){
            this.gettingDressed = true; // text follows player 
        }else if (!this.disguiseActive){
            this.gettingDressed = false;
            this.scene.dressedText.x = this.y - 1000; 
        }

        //Dropping through platforms (while DOWN + JUMP is held down)
        if(keyDown.isDown && keyJump.isDown){
            this.scene.platformCollision.active = false;
        }
        else{
            this.scene.platformCollision.active = true;
        }
    }

    disguiseOn(){
            console.log("Disguise On");
            this.disguiseActive = true;
            this.gettingDressed = false;               //turn these on when we have visuals
            //this.scene.dressedText.x = this.y - 300;
            this.tempUI = true; //remove later 
            this.scene.dressedText.text = "Disguised"; // remove later

    }
    disguiseOff(){
        this.disguiseActive = false;
    }
    detectedFunc(){
            this.detected = true;
            this.scene.gameOver = true;
            this.scene.check++;
    }
    gameOverFunc(){
        this.scene.add.text(game.config.width/2, game.config.height/2-15, 'GAMEOVER' ).setOrigin(0.5);
        this.scene.restartbutton = this.scene.add.text(game.config.width/2, game.config.height/2 +32 , 'Restart', {color: '#FF994F'}).setOrigin(0.5);
        this.scene.MainMenubutton = this.scene.add.text(game.config.width/2, game.config.height/2 +64 , 'Main Menu' ,{color: '#FFFFFF'}).setOrigin(0.5);
    }
}