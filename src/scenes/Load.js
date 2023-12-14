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
            loadingBar.fillStyle(0x000000, 1);
            loadingBar.fillRect(0, height/2, width * value, 5);
        })
        this.load.on("Complete", () => {
            loadingBar.destroy();
            
        })
        //load json
        this.load.json("dialogue", "./info.json");
        //load images
        this.load.path = "./assets/img/";
        this.load.image("dashboard", "dashboard.png");
        this.load.image("bus", "bus.png");
        this.load.image("busBack", "bus_back.png");
        this.load.image("pause", "pause.png");
        this.load.image("track1_img", "track_1.png");
        this.load.image("track2_img", "track_2.png");
        this.load.image("phoneScreen", "phone_screen.png");
        this.load.image("thoughtCloud", "thought_cloud.png");
        //  spritesheets
        this.load.spritesheet("steeringWheel", "wheel.png", {
            frameWidth: 347,
            frameHeight: 353,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet("dial", "dial.png", {
            frameWidth: 21,
            frameHeight: 21,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet("soda", "soda.png", {
            frameWidth: 76,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 3
        })
        this.load.spritesheet("burger", "burger.png", {
            frameWidth: 120,
            frameHeight: 90,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet("glovebox", "glovebox_soda.png", {
            frameWidth: 315, 
            frameHeight: 118, 
            startFrame: 0,
            endFrame: 6
        });
        this.load.spritesheet("radioSwitch", "radio_switch.png", {
            frameWidth: 57,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 9
        })
        this.load.spritesheet("road", "road.png", {
            frameWidth: 960,
            frameHeight: 640,
            startFrame: 0,
            endFrame: 5
        })
        //load fonts
        this.load.path = "./assets/fonts/";
        this.load.bitmapFont("titleFont", "title_font.png", "title_font.xml");
        this.load.bitmapFont("subtitleFont", "subtitle_font.png", "subtitle_font.xml");
        this.load.bitmapFont("textFont", "text_font.png", "text_font.xml");
        //load sound
        this.load.path = "./assets/audio/"
        this.load.audio("track1", "track_1.mp3");
        this.load.audio("track2", "track_2.mp3");
        this.load.audio("carStart", "car_start.mp3");
        this.load.audio("ambiance", "ambiance.mp3");
        this.load.audio("burgerEat", "eating_sfx.mp3");
        this.load.audio("sodaDrink", "gulp_sfx.mp3");
        this.load.audio("openGlovebox", "open_box_sfx.mp3");
        this.load.audio("closeGlovebox", "close_box_sfx.mp3");

    }

    create() {
        this.scene.start("menuScene");
    }
}