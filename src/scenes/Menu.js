class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        //  create graphics
        const graphics = this.add.graphics();

        //  background image
        let road = this.add.image(0, 0, "roadSide").setOrigin(0);
        road.depth = -1;
        //  bus image
        let bus = this.add.image(width/2, height/2, "bus").setScale(1.5);
        //  interactive button: invisible
        let startButton = this.add.rectangle(width/2, (height/6)*5, 200, 50, 0x000000, 0);
        //  graphics: just a visual, nothing we're treating like a movable sprite. button background
        //      black outline
        graphics.fillStyle(0x000000);
        graphics.fillRoundedRect(width/2-102, (height/6)*5-27, 204, 54);
        //      rounded, yellow rectangle
        graphics.fillStyle(0xe7cc47);
        graphics.fillRoundedRect(width/2-100, (height/6)*5-25, 200, 50);
        //  text
        //      title text, that moves with the bus
        let title = this.add.dynamicBitmapText(width/2+75, height/2-30, "titleFont", "DIGITAL STUCK BEHIND A BUS", 80).setOrigin(0.5).setCenterAlign();
        title.maxWidth = 400;
        //      button text, what appears on the starting button
        this.add.dynamicBitmapText(width/2, (height/6)*5+4, "subtitleFont", "DRIVE", 64).setOrigin(0.5);

        //audio upon clicking the start button
        let carStart = this.sound.add("carStart", {
            mute: false,
            volume: 0.5,
            loop: true
        });

        //start button interactivity
        startButton.setInteractive({
            hitArea: startButton,
            useHandCursor: true
        });
        
        startButton.on("pointerdown", () => {
            carStart.play();
            //  tweens
            //      bus: drive off the screen
            let busTween = this.tweens.add({
                targets: bus,
                ease: "Bounce.easeIn",
                paused: true,
                yoyo: false,
                x: {
                    from: bus.x,
                    to: -500,
                    duration: 2000
                }
            })
            //      title text should move with the bus!
            let titleTween = this.tweens.add({
                targets: title,
                ease: "Bounce.easeIn",
                paused: true,
                yoyo: false,
                x: {
                    from: title.x,
                    to: -500,
                    duration: 2000
                }
            })
            busTween.play();
            titleTween.play();

            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    carStart.stop();
                    this.scene.start("playScene");
                }
            })
        })
    }
}