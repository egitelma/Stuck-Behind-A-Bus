class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        //I got the loading bar from Nathan's Github - here's the source he had linked:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        this.load.on("progress", (value) => {
            loadingBar.clear();
            loadingBar.fillStyle(0xDABBED, 1);
            loadingBar.fillRect(0, height/2, width * value, 5);
        })
        this.load.on("complete", () => {
            loadingBar.destroy();
            
        })
        this.load.path = "./assets/"
        this.load.image("dashboard", "dashboard.png");
        this.load.image("steeringWheel", "wheel.png");
        this.load.image("dial", "dial.png");
        this.load.image("bus", "bus.png");
        this.load.image("pause", "pause.png");
        this.load.image("road", "road.png");
        this.load.spritesheet("glovebox", "glovebox.png", {
            frameWidth: 315, 
            frameHeight: 118, 
            startFrame: 0,
            endFrame: 3
        });
        this.load.spritesheet("radioSwitch", "radio_switch.png", {
            frameWidth: 57,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 7
        })
        this.load.bitmapFont("titleFont", "title_font.png", "title_font.xml")
        this.load.bitmapFont("subtitleFont", "subtitle_font.png", "subtitle_font.xml")
    }

    create() {
        this.scene.start("menuScene");
    }
}