/* An object the player can interact with to activate (such as a button) - Santiago*/

class ObjInteract extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.playerRef = this.scene.plrSpy
        this.activated = false;
        this.repeatable = false; //Allows being activated more than once
        this.body.allowGravity = false;
    }

    update(time, delta){
        //Can be interacted with if either not activated, or can be activated multiple times
        if(this.scene.physics.overlap(this, this.playerRef) && (!this.activated || this.repeatable)){
            console.log("Player is overlapping");
            if(Phaser.Input.Keyboard.JustDown(keyInteract)){
                this.activate();
            }
        }
    }

    activate(){
        this.activated = true;
        console.log("Object was activated")
    }
}