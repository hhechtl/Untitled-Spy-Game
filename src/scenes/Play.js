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
        this.defineKeys()

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


        //Create player + objects
        this.plrSpy = new PlayerSpy(this, game.config.width/2-250, game.config.height/2+110);
        this.createButtons();

        //let rect = this.add.rectangle( 150, 250, 50, 50).setStrokeStyle(1, 0xff0000); Used for debugging

        //creating detectors for level
        this.degree = 0;
        this.raycaster = this.raycasterPlugin.createRaycaster({debug:false}); //when debugging is true, we get an error when we restart a level
        this.graphics;
        this.intersections;
        this.createSpotlights([solidLayer]);
        

        //moving text 
        this.dressedText = this.add.text(game.config.width/2 + 600, game.config.height/2, 'Getting dressed...',{fontSize: '9px'} ).setOrigin(0.5);
        this.gameOver = false;
        this.check = 0; // makes sure end screen doesnt apply more than once;


        //colliders
        this.physics.add.collider(this.plrSpy, solidLayer);
        this.platformCollision = this.physics.add.collider(this.plrSpy, platformLayer);
    
        //Rotates the cone and re-fills the intersections list
        this.rotate = this.time.addEvent({ delay: 100, callback: () =>{
            this.ray.setAngleDeg(this.degree++);
            this.intersections = this.ray.castCone();
            this.path.getPoint(this.follower.t, this.follower.vec);
            this.ray.setOrigin(this.follower.vec.x, this.follower.vec.y);
            //second light 
            this.ray2.setAngleDeg(this.degree+180);
            this.intersections2 = this.ray2.castCone();
            // fixes bug where send ray jumps onto the 
            //same path as the first array
            if(this.path.getPoint(this.follower.t+0.5, this.follower.vec) == null){
                this.path.getPoint(this.follower.t - 0.5, this.follower.vec);
            }
            this.ray2.setOrigin(this.follower.vec.x, this.follower.vec.y);
            this.drawLOS();
            
    
         }, loop: true });
    }

    update(time, delta ) {
        if(!this.gameOver){
            this.plrSpy.update(time, delta); 
        }
        if(this.gameOver &&this.check == 1){
            this.plrSpy.gameOverFunc();
            this.sound.play('sfx_discovered');
        }
        //allows text to follow player while getting dressed 
        if(this.plrSpy.gettingDressed || this.plrSpy.tempUI){
            this.dressedText.x = this.plrSpy.x +10;
            this.dressedText.y = this.plrSpy.y - 30;
        }
        //game over selection 
        if(this.gameOver){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(sceneSelect == 'playScene'){
                    this.restartbutton.setColor('#FFFFFF');
                    this.MainMenubutton.setColor('#FF994F');
                    sceneSelect = 'menuScene';
                }
                else if(sceneSelect == 'menuScene'){
                    this.MainMenubutton.setColor('#FFFFFF');
                    this.restartbutton.setColor('#FF994F');
                    sceneSelect = 'playScene';
                }  
              }
            if (Phaser.Input.Keyboard.JustDown(keyInteract)) {
                if(sceneSelect == 'playScene'){
                    this.restartbutton.setColor('#FFFFFF');
                    this.MainMenubutton.setColor('#FF994F');
                    sceneSelect = 'menuScene';
                }
                else if(sceneSelect == 'menuScene'){
                    this.MainMenubutton.setColor('#FFFFFF');
                    this.restartbutton.setColor('#FF994F');
                    sceneSelect = 'playScene';
                }  
            }  
            if (Phaser.Input.Keyboard.JustDown(keyJump)) {
                //console.log('selecting');
                this.scene.start(sceneSelect);    
            }  
        }
    }


    //We will have multiple rays per scene, so we may want to set this up so that it loops over all rays or something
    createSpotlights(mappedObjects){
        //https://github.com/wiserim/phaser-raycaster
        this.ray = this.raycaster.createRay();
        this.ray2 = this.raycaster.createRay();

        // path to rotate along 
        this.path = new Phaser.Curves.Path();
        this.path.add(new Phaser.Curves.Ellipse(game.config.width/2, game.config.height/2-15, 25));
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.tweens.add({
            targets: this.follower,
            t: 1,
            duration: 35025,
            loop: -1
        });
        this.ray.setOrigin(this.follower.vec.x, this.follower.vec.y);
        this.ray2.setOrigin(this.follower.vec.x, this.follower.vec.y);
        
        this.ray.setAngleDeg(this.degree);
        this.ray.setConeDeg(180);
        this.ray2.setAngleDeg(this.degree+180);
        this.ray2.setConeDeg(180);

        //enable auto slicing field of view
        this.ray.autoSlice = true; 
        this.ray.enablePhysics();
        this.ray2.autoSlice = true; 
        this.ray2.enablePhysics();

        /*Could potentially limit the LOS range visually by surrounding it with a circle it colldies with,
        matching the radius of the ray's collision range.*/
        //this.rayContainer = this.add.circle(this.ray.origin.x, this.ray.origin.y, 200);
        //mappedObjects.push(this.rayContainer);

        //Maps objects to the ray so it can collide with them
        this.raycaster.mapGameObjects(mappedObjects, false, {collisionTiles: [6, 11]}); 
        
        //set collision (field of view) range
        this.ray.setCollisionRange(200);
        this.ray2.setCollisionRange(200);

        //cast ray
        this.intersections = this.ray.castCone();
        this.intersections2 = this.ray2.castCone();
        

        //Draw ray LoS
        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.3 } });
        this.drawLOS();


        //if player is caught in light 
        this.physics.add.overlap(this.ray, this.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                console.log("detected");
               // target.detectedFunc();
            }
        }, this.ray.processOverlap.bind(this.ray));
        this.physics.add.overlap(this.ray2, this.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                console.log("detected by 2");
                //target.detectedFunc();
            }
        }, this.ray2.processOverlap.bind(this.ray2));

    }

    drawLOS(){
        this.intersections.push(this.ray.origin);
        //console.log(this.intersections);
        this.graphics.clear();
        this.graphics.fillStyle(0xffffff, 0.3);
        this.graphics.fillPoints(this.intersections);
        this.graphics.fillPoints(this.intersections2);
        this.path.draw(this.graphics);    
    };

    defineKeys(){
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyDisguise = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyInteract = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    createButtons(){
        //Create buttons
        this.groupButtonObjs = this.add.group([new ObjInteract(this, 272, 32, 'objButton'),
        new ObjInteract(this, 16, 208, 'objButton'), new ObjInteract(this, 528, 208, 'objButton'),
        new ObjInteract(this, 272, 432, 'objButton')]);
        this.groupButtonObjs.runChildUpdate = true;
        //Create objective tracker
        this.buttonTracker = new Checklist(this, "buttonTracker", this.groupButtonObjs.countActive());

        //Add event for each button when they are pressed, listening for the signal 'objactivated'
        let buttons = this.groupButtonObjs.getChildren(); //More like a dict than an array...
        for(let i = 0; i < buttons.length; i++){
        let button = buttons[i];
        button.on('objactivated', () => {
            this.buttonTracker.addObjective();
        });
        }
        /*With ability to establish events and listeners, we could theoretically add a locked door 
        (which I'll add later) - Santiago*/
    }

}