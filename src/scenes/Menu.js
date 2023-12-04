class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        textConfig = {
            fontFamily: "Courier New",
            fontSize: "32px",
            color: "0x000000",
            align: "left",
        }

        let bus = this.add.image(width/2, height/2, "bus").setScale(1.5);
        let startButton = this.add.rectangle(width/2, (height/4)*3, 200, 50, 0xFFFFFF);

        let title = this.add.dynamicBitmapText(width/2+75, height/2-30, "titleFont", "DIGITAL STUCK BEHIND A BUS", 80).setOrigin(0.5).setCenterAlign();
        title.maxWidth = 400;
        let startText = this.add.dynamicBitmapText(width/2, (height/4)*3, "subtitleFont", "PLAY", 64).setOrigin(0.5);

        startButton.setInteractive({
            hitArea: startButton,
            useHandCursor: true
        });
        startButton.on("pointerdown", () => {
            this.scene.start("playScene");
        })
        
    }
}