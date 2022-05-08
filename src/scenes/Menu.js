class Menu extends Phaser.Scene {
      constructor(){
          super("menuScene");
      }

      preload(){
          
      }

      create(){
            let MenuConfig = {
                  fontFamily:  'Ariel', 
                  fontSize: '16px',
                  backgroundColor: null,
                  color: '#FF994F'
            }

            this.add.text(game.config.width/2, game.config.height/2, 'Main Menu', MenuConfig).setOrigin(0.5);
      }

      update(time, delta){

      }
}