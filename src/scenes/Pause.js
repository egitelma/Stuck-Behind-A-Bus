class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }

    create() {
        let pauseFilter = this.add.rectangle(carWidth/2, height/2, carWidth, height, 0x000000, .5);
        let pauseBG = this.add.rectangle(carWidth/2, height/2, 450, 450, 0xFFFFFF);
        let pauseTitle = this.add.dynamicBitmapText(carWidth/2, height/4, "subtitleFont", "PAUSED", 80).setOrigin(0.5);
        let pauseInfo = this.add.dynamicBitmapText(carWidth/2, height/2, "titleFont", "back to menu", 32).setOrigin(0.5).setInteractive({
                useHandCursor: true
            })
        //  an image just so that it's not underneath the shaded filter, and it's clear how to return back to Play - not actually interactable.
        let pauseButton = this.add.image(carWidth-32, 32, "pause")

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