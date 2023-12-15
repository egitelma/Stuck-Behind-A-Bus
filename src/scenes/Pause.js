class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }

    create() {
        //  visuals: shaded filter over playScene, white rectangle base, and pause title text
        this.add.rectangle(carWidth/2, height/2, carWidth, height, 0x000000, .5);
        this.add.rectangle(carWidth/2, height/2, 450, 450, 0xFFFFFF);
        this.add.dynamicBitmapText(carWidth/2, height/4, "subtitleFont", "PAUSED", 80).setOrigin(0.5);
        let pauseInfo = this.add.dynamicBitmapText(carWidth/2, height/2, "titleFont", "back to menu", 32).setOrigin(0.5).setInteractive({
                useHandCursor: true
            })
        //  an image just so that it's not underneath the shaded filter, and it's clear how to return back to Play - not actually interactable.
        this.add.image(carWidth-32, 32, "pause")

        //interactivity
        pauseInfo.on("pointerdown", () => {
            //  stop sound
            this.game.sound.stopAll();
            //  and go back
            this.scene.stop("playScene");
            this.scene.stop();
            this.scene.start("menuScene");
        })
    }
}