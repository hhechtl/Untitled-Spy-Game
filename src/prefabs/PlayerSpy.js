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

        //needs to be tweaked 
        this.normalMoveSpeed = 350; //Horizontal movement
        this.slowedMoveSpeed = 250; // slowed movement speed
        this.setMaxVelocity(250); // max velocity 
        this.setDragX(400);
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
        if(keyLeft.isDown && this.x > 0 ){
            this.disguiseActive ? this.setAccelerationX(-this.normalMoveSpeed) : this.setAccelerationX(-this.slowedMoveSpeed);
        }
        else if(keyRight.isDown && this.x < config.width){
            this.disguiseActive ? this.setAccelerationX(this.normalMoveSpeed) : this.setAccelerationX(this.slowedMoveSpeed);
        }
        else{
            this.setVelocityX(0);
            this.setAccelerationX(0);
        }

    }
    disguiseOn(){
        this.disguiseActive = true;
    }
    disguiseOff(){
        this.disguiseActive = false;
    }
}