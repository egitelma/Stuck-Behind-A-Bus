class GameOver extends Phaser.Scene {
    constructor(){
        super("gameOverScene");
    }

    create() {
        this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
        this.add.rectangle(width/4, height/4, width/2, height/2, 0xFFFFFF).setOrigin(0);
        this.add.dynamicBitmapText(width/2, height/2, "titleFont", "GAME OVER...", 80).setOrigin(0.5);

        let button = this.add.rectangle(width/3*2, height/3*2, 100, 50, 0xFFFFFF);
        let clicker = this.add.dynamicBitmapText(width/3*2, height/3*2, "titleFont", "back to menu", 32).setOrigin(0.5).setInteractive({
            hitArea: button,
            useHandCursor: true
        });

        clicker.on("pointerdown", () => {
            this.scene.start("menuScene");
        })
    }
}