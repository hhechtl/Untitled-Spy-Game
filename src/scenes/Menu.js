class Menu extends Phaser.Scene {
      constructor(){
          super("menuScene");
      }

      preload(){
        //load audio
        this.load.audio('sfx_select', './assets/sfx/Blip_Select.wav');
        this.load.audio('sfx_disguise', 'assets/sfx/Disguise_applied.wav');
        this.load.audio('sfx_finishedObjective', 'assets/sfx/Finished_objective.wav');
        this.load.audio('sfx_jump', 'assets/sfx/Jump2.wav');
        this.load.audio('sfx_discovered', 'assets/sfx/Player_discovered.wav');
          
      }

      create(){
            let MenuConfig = {
                  fontFamily:  'Ariel', 
                  fontSize: '16px',
                  backgroundColor: null,
                  color: '#FF994F'
            }

            this.add.text(game.config.width/2, game.config.height/2 -96, 'Main Menu', MenuConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 -64, 'Press Z to Select', MenuConfig).setOrigin(0.5);

            //setting up keys
            keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

            //setting up "buttons" for scene selecting 
            MenuConfig.color =  '#FFFFFF';
            this.playbutton = this.add.text(game.config.width/2, game.config.height/2 - 32 , 'New Game', MenuConfig).setOrigin(0.5);
            MenuConfig.color =  '#808080';
            this.loadgamebutton = this.add.text(game.config.width/2, game.config.height/2, 'Load Game', MenuConfig).setOrigin(0.5); //not set up, will do when we save data
            MenuConfig.color =  '#FF994F';
            this.lsbutton = this.add.text(game.config.width/2, game.config.height/2 +32 , 'Level Select', MenuConfig).setOrigin(0.5);
            this.optionsbutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Options', MenuConfig).setOrigin(0.5);
            this.creditsbutton = this.add.text(game.config.width/2, game.config.height/2 +96 , 'Credits', MenuConfig).setOrigin(0.5);
            sceneSelect = 'playScene'; //reinitalize menu

      }

      update(time, delta){
            // to select a scene 
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                  if(sceneSelect == 'playScene'){
                     this.updateMenu(this.playbutton,this.lsbutton, 'levelselectScene');
                  }
                  else if(sceneSelect == 'levelselectScene'){
                      this.updateMenu(this.lsbutton, this.optionsbutton, 'optionsScene');
                  }  
                  else if(sceneSelect == "optionsScene"){
                      this.updateMenu(this.optionsbutton, this.creditsbutton, 'creditScene');
                  }
                  else if (sceneSelect == "creditScene"){
                      this.updateMenu(this.creditsbutton, this.playbutton, "playScene");
                  }
                }
              if (Phaser.Input.Keyboard.JustDown(keyUp)) {
                  if(sceneSelect == 'playScene'){
                     this.updateMenu(this.playbutton,this.creditsbutton, 'creditScene');
                  }
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.playbutton, 'playScene');
                }  
                else if(sceneSelect == "optionsScene"){
                    this.updateMenu(this.optionsbutton, this.lsbutton, "levelselectScene");
                }
                else if (sceneSelect == "creditScene"){
                    this.updateMenu(this.creditsbutton, this.optionsbutton, "optionsScene");
                }
              }
              //selects the scene 
              if (Phaser.Input.Keyboard.JustDown(keyJump)) { 
                    this.sound.play('sfx_select');
                    this.scene.start(sceneSelect);    
                }

      }
      updateMenu(current, next, scene){
            next.setColor('#FFFFFF');
            current.setColor('#FF994F');
            sceneSelect = scene;
      }
}