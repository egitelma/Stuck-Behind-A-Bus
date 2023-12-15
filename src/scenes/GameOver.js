class GameOver extends Phaser.Scene {
    constructor(){
        super("gameOverScene");
    }

    create() {
        //  fade the camera in
        this.cameras.main.fadeIn(2000, 255, 255, 255);

        //SHAPES
        //  shapes: background box, white inner box
        this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
        this.add.rectangle(width/4, height/4, width/2, height/2, 0xFFFFFF).setOrigin(0);

        //TEXT
        //  game success/fail text
        //  if we won the game, show that! or else just say game over.
        if(gameWon){
            this.add.bitmapText(width/2, height/2, "titleFont", "GAME WON!", 80).setOrigin(0.5);
        }
        else {
            this.add.bitmapText(width/2, height/2, "titleFont", "GAME OVER...", 80).setOrigin(0.5);
        }
        //  credits
        this.add.bitmapText(10, 10, "textFontWhite", "Programming by Liza Gitelman", 12).setOrigin(0);
        this.add.bitmapText(10, 30, "textFontWhite", "Design by Liza Gitelman", 12).setOrigin(0);
        this.add.bitmapText(10, 50, "textFontWhite", "Art by Liza Gitelman", 12).setOrigin(0);
        this.add.bitmapText(10, 70, "textFontWhite", "Music:", 12).setOrigin(0);
        this.add.bitmapText(30, 90, "textFontWhite", "Super Spiffy by David Fesliyan", 12).setOrigin(0);
        this.add.bitmapText(30, 110, "textFontWhite", "Prairie Evening by Steve Oxen", 12).setOrigin(0);
        this.add.bitmapText(10, 130, "textFontWhite", "Fonts:", 12).setOrigin(0);
        this.add.bitmapText(30, 150, "textFontWhite", "Weekly Planner by Mozatype", 12).setOrigin(0);
        this.add.bitmapText(30, 170, "textFontWhite", "Hooey by Dharmas Studio", 12).setOrigin(0);
        this.add.bitmapText(30, 190, "textFontWhite", "F25 Bank Printer by Volker Busse", 12).setOrigin(0);
        this.add.bitmapText(10, 210, "textFontWhite", "SFX:", 12).setOrigin(0);
        this.add.bitmapText(30, 230, "textFontWhite", "parking lot ambience by Pixabay", 12).setOrigin(0);
        this.add.bitmapText(30, 250, "textFontWhite", "Eating sound effect by Pixabay", 12).setOrigin(0);
        this.add.bitmapText(30, 270, "textFontWhite", "heavy_swallow.wav by Pixabay", 12).setOrigin(0);
        this.add.bitmapText(30, 290, "textFontWhite", "Open Toolbox by Pixabay", 12).setOrigin(0);
        this.add.bitmapText(30, 310, "textFontWhite", "lid close by Pixabay", 12).setOrigin(0);
        this.add.bitmapText(30, 330, "textFontWhite", "Click Button by UNIVERSFIELD", 12).setOrigin(0);
        this.add.bitmapText(30, 350, "textFontWhite", "043210_CarStartSkidCrash.wav by", 12).setOrigin(0);
        this.add.bitmapText(30, 370, "textFontWhite", "Pixabay", 12).setOrigin(0);
        //  button to be clicked on
        let clicker = this.add.bitmapText(width/3*2, height/3*2, "titleFont", "back to menu", 32).setOrigin(0.5).setInteractive({
            useHandCursor: true
        });

        //  the actual interactivity of the button
        clicker.on("pointerdown", () => {
            this.scene.start("menuScene");
        })
    }
}