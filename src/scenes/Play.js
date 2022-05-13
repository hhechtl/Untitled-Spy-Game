class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload(){
        // load tileset and tilemap
        /* NOTE: We may want to move this to a master 'load' scene, so we don't have to load the tileset
        every time we want to create a level. - Santiago */
        this.load.path = 'assets/';
        this.load.image('tilesCityPH', 'PH_city_tiles_small.png');
        this.load.tilemapTiledJSON('lvlDigitalProto', 'levels/level_digital_prototype.json');
        
        this.load.image('objButton', 'PH_obj_button.png');
    }

    create() {
        //Adding tilemap
        const mapProto = this.make.tilemap({key: 'lvlDigitalProto'});
        const tilesCity = mapProto.addTilesetImage('PH_city_tiles', 'tilesCityPH');
        // 1st arg, the tileset name, needs to match the tileset name in the Tiled file (check the program)

        //Creates layers matching the layers we made in Tiled software
        let solidLayer = mapProto.createLayer('Solid', tilesCity, -16, -16);
        let platformLayer = mapProto.createLayer('Platform', tilesCity, -16, -16);
        //Caredful that all of the keys and stuff match what was defined in the Tiled file.
        
        //Makes all tiles that have property "collides" have collision
        solidLayer.setCollisionByProperty( {collides: true} );
        platformLayer.setCollisionByProperty( {collides: true} );
        //Makes all the platform tiles only have 1-way collision
        platformLayer.forEachTile(tile => {
            if(tile.index == 16){
                tile.collideLeft = false;
                tile.collideRight = false;
                tile.collideDown = false;
            }
        })

        this.add.text(game.config.width/2, game.config.height/2, 'PLAY' ).setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        
        //defining keys 
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyDisguise = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyInteract = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        

        //create player 
        this.plrSpy = new PlayerSpy(this, 100, 50);
        //Create buttons
        this.groupButtonObjs = this.add.group([new ObjInteract(this, 272, 32, 'objButton'),
         new ObjInteract(this, 16, 208, 'objButton'), new ObjInteract(this, 528, 208, 'objButton'),
         new ObjInteract(this, 272, 432, 'objButton')]);
        this.groupButtonObjs.runChildUpdate = true;
        //Create objective tracker
        this.buttonTracker = new Checklist(this, "buttonTracker", this.groupButtonObjs.length);

        // group of detectors
        // if player i caught in one game ends
        this.groupDetectors = this.physics.add.group();
        this.groupDetectors.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupDetectors.runChildUpdate = true;
        
        // temp detector
        //this.groupDetectors.add(new LOS(this, 200,100));

        this.physics.add.collider(this.plrSpy, solidLayer);
        this.platformCollision = this.physics.add.collider(this.plrSpy, platformLayer);
        //For dropping through platforms, we can temporarly disable the collider between player and platform layer
        
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