class GameOver extends Phaser.Scene {
    constructor(){
        super("gameOverScene");
    }

    create() {
        //  fade the camera in
        this.cameras.main.fadeIn(2000, 255, 255, 255);

        //  shapes: background box, white inner box
        this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
        this.add.rectangle(width/4, height/4, width/2, height/2, 0xFFFFFF).setOrigin(0);

        //  game success/fail text
        //  if we won the game, show that! or else just say game over.
        if(gameWon){
            this.add.dynamicBitmapText(width/2, height/2, "titleFont", "GAME WON!", 80).setOrigin(0.5);
        }
        else {
            this.add.dynamicBitmapText(width/2, height/2, "titleFont", "GAME OVER...", 80).setOrigin(0.5);
        }

        //  button to be clicked on
        // let button = this.add.rectangle(width/3*2, height/3*2, 100, 50, 0xFFFFFF);
        let clicker = this.add.dynamicBitmapText(width/3*2, height/3*2, "titleFont", "back to menu", 32).setOrigin(0.5).setInteractive({
            useHandCursor: true
        });

        //  the actual interactivity of the button
        clicker.on("pointerdown", () => {
            this.scene.start("menuScene");
        })
    }
}