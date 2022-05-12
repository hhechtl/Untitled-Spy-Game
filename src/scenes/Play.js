class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload(){
        // load tileset and tilemap
        /* NOTE: We may want to move this to a master 'load' scene, so we don't have to load the tileset
        every time we want to create a level. - Santiago */
        this.load.path = 'assets/';
        this.load.image('tilesCityPH', 'PH_city_tiles.png');
        this.load.tilemapTiledJSON('lvlDigitalProto', 'levels/level_digital_prototype.json');
        console.log("Finished loading");
    }

    create() {
        //Adding tilemap
        const mapProto = this.make.tilemap({key: 'lvlDigitalProto'});
        const tilesCity = mapProto.addTilesetImage('lvlDigitalProto', 'tilesCityPH', 16, 16);

        //Creates layers matching the layers we made in Tiled software
        let wallsLayer = mapProto.createLayer('Solid', tilesCity);
        
        //Makes all tiles that have property "collides" have collision
        wallsLayer.setCollisionByProperty( {collides: true} );


        this.add.text(game.config.width/2, game.config.height/2, 'PLAY' ).setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        
        //defining keys 
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        //create player 
        this.plrSpy = new PlayerSpy(this, 100, 50,);

        //temp floor
        this.floor = new Floor(this,200,game.config.height);
        this.physics.add.collider(this.plrSpy,this.floor);
    }

    update(time, delta ) {
        this.plrSpy.update(time, delta);
    }

}