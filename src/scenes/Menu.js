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
        const graphics = this.add.graphics();

        //bus is the bus image
        //startButton is the interactable restangle to click on in order to start the game
        //startRect is the visual rounded rectangle button
        //title is the title text
        //startText is the text on the play button
        let bus = this.add.image(width/2, height/2, "bus").setScale(1.5);
        let startButton = this.add.rectangle(width/2, (height/6)*5, 200, 50, 0x000000, 0);
        graphics.fillStyle(0xe7cc47);
        let startRect = graphics.fillRoundedRect(width/2-100, (height/6)*5-25, 200, 50);
        let title = this.add.dynamicBitmapText(width/2+75, height/2-30, "titleFont", "DIGITAL STUCK BEHIND A BUS", 80).setOrigin(0.5).setCenterAlign();
        title.maxWidth = 400;
        let startText = this.add.dynamicBitmapText(width/2, (height/6)*5+4, "subtitleFont", "DRIVE", 64).setOrigin(0.5);

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