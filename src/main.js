let config = {
      type: Phaser.AUTO,
      width: 544, // 16 x 9 aspect ratio. Can be scaled up by 2 for fullscreen or divided by 3 to get a good pixel art size
      height: 480,
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 2 //4
      },
      physics: {
          default: 'arcade',
          arcade: {
                gravity: { y: 1000 },
                debug: true
          }
      },
      scene: [ Menu, Play, Option, Credit, LevelSelect],
      plugins:{
        scene: [
          {
            key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
          }
        ]
      }
  }
  
  let game = new Phaser.Game(config);

  // initializing variables 
  let sceneSelect = 'playScene'; // for selecting between scenes 

  //reserve keyboard vars
  let keyLeft, keyRight, keyUp, keyDown, keyJump, keyDisguise, keyInteract;