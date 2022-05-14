// This is a tracker used for when multiple game objectives must be achieved.
// Such as pressing all buttons - Santiago

//import Phaser from 'phaser';

class Checklist extends Phaser.GameObjects.GameObject {
    constructor(scene, type, objectives){
        super(scene, type);
        this.objectivesNeeded = objectives; //Number of 'things' before this calls a function
        this.objectives = 0;
    }

    addObjective(amount = 1){
        console.log("Objective complete");
        this.objectives += amount
        if(this.objectives >= this.objectivesNeeded){
            this.allComplete();
        }
    }

    allComplete(){
        console.log("All objectives complete for a checklist");
        this.emit('allcomplete'); //Really gotta use 'this' for everything huh? - Santiago
    }
}