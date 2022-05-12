class LOS extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, shape, size ) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.allowGravity = false;

        if(shape == 'circle'){
            this.setCircle(size);
        }else if (shape == 'triangle'){
            this.setTriangle(size);
        }


    }
    update(){

    }
}