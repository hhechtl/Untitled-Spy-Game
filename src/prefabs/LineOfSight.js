class LOS extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, frame, texture, ) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.allowGravity = false;

        
    }
    update(){
 
    }
    
}