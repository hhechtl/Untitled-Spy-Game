let config = {
      type: Phaser.AUTO,
      width: 400, // 16 x 9 aspect ratio. Can be scaled up by 2 for fullscreen or divided by 3 to get a good pixel art size
      height: 225,
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 4 //4
      },
      physics: {
          default: 'arcade',
          arcade: {
                gravity: { y: 1000 },
                debug: true
          }
      },
      scene: [ Menu, Play, Option, Credit, LevelSelect]
  }
  
  let game = new Phaser.Game(config);

  // initializing variables 
  let sceneSelect = 'playScene'; // for selecting between scenes 

  //reserve keyboard vars
  let keyLeft, keyRight, keyUp, keyDown, keyJump, keyDisguise;