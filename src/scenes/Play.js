class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        //LOAD ANIMATIONS
        loadAnims(this);

        //VARIABLES
        let gloveboxOpen = false; //false for closed box, true for opened box
        let radioOn = true; //radio starts on
        let radioAngle = 0; //for now, this is only ever 0 or 180. two stations
        let gamePaused = false;

        //SET THE SCENE
        const graphics = this.add.graphics();
        //HITBOXES: glovebox, radio switch
        let gloveHitbox = new Phaser.Geom.Polygon([
            635, 587,
            651, 492,
            931, 470,
            903, 572
        ]);
        //radio switch gradient/hitbox
        graphics.fillGradientStyle(0x6ABE30, 0xAC3232, 0x6ABE30, 0xAC3232);
        let radioGradient = graphics.fillRect(456, 494, 57, 16);
        radioGradient.depth = -1;
        //  car content
        this.add.image(0, 0, "dashboard").setOrigin(0);
        let steeringWheel = this.add.sprite(174, 430, "steeringWheel").setInteractive({
            hitArea: this.add.circle(160, 252, 176),
            useHandCursor: true 
        });
        let glovebox = this.add.sprite(635, 470, "glovebox").setOrigin(0).setInteractive({
            hitArea: gloveHitbox,
            useHandCursor: true
        });
        let radioSwitch = this.add.sprite(456, 494, "radioSwitch").setOrigin(0).setInteractive({
            hitArea: radioGradient,
            useHandCursor: true
        });
        radioSwitch.depth = 1;
        let radioDial = this.add.sprite(485, 480, "dial").setInteractive({
            hitArea: this.add.circle(485, 480, 11),
            useHandCursor: true
        });
        //  outside the car
        let road = this.add.image(0, 0, "road").setOrigin(0);
        road.depth = -2

        //UI
        //boredom meter
        const boredomBG = this.add.rectangle(5, 5, 200, 30, 0xFFFFFF).setOrigin(0);
        let boredomRect = this.add.rectangle(5, 5, 10, 30, 0xFF0000).setOrigin(0);
        this.add.dynamicBitmapText(5, 5, "subtitleFont", "boredom meter", 32).setOrigin(0);
        //pause button
        let pause = this.add.sprite(width-32, 32, "pause").setInteractive({
            useHandCursor: true
        })
        pause.depth = 3;
        //create pause menu
        let pauseFilter = this.add.rectangle(0, 0, width, height, 0x000000, .5).setOrigin(0);
        let pauseBG = this.add.rectangle(width/2, height/2, 450, 450, 0xFFFFFF);
        let pauseTitle = this.add.dynamicBitmapText(width/2, height/4, "subtitleFont", "PAUSED", 80).setOrigin(0.5);
        pauseFilter.depth = -3;
        pauseBG.depth = -3;
        pauseTitle.depth = -3;

        
        //I drew the image first, then found the coordinates of the image in the drawing app. That's why they're so irregular.
        //635 587: bottom left
        //651 492: top left
        //931 470: top right
        //903 572: bottom right

        //EVENT HANDLING: on-click, timed

        //steering wheel interactivity
        steeringWheel.on("pointerdown", () => {
            this.tweens.add({
                targets: steeringWheel,
                ease: "Bounce.easeIn",
                paused: true,
                yoyo: true,
                angle: {
                    from: 0,
                    to: 45,
                    duration: 500
                }
            }).play();
        })

        //glovebox interactivity
        glovebox.on("pointerdown", () => {
            if(!gloveboxOpen) {
                gloveboxOpen = true;
                glovebox.play("glovebox-open");
            }
            else {
                gloveboxOpen = false;
                glovebox.play("glovebox-close");
            }
        })

        //radio interactivity: turn on/off with switch, change radio station/spin dial
        radioSwitch.on("pointerdown", () => {
            if(!radioOn) {
                radioOn = true;
                radioSwitch.play("radio-off");
            }
            else {
                radioOn = false;
                radioSwitch.play("radio-on")
            }
        })
        radioDial.on("pointerdown", () => {
            this.tweens.add({
                targets: radioDial,
                paused: true,
                yoyo: false,
                angle: {
                    from: radioAngle,
                    to: radioAngle + 180,
                    duration: 100
                }
            }).play();
            radioAngle += 180;
            if(radioAngle == 360){
                radioAngle = 0;
            }
        });

        //pausing/unpausing
        pause.on("pointerdown", () => {
            //if pausing, bring menu forward (depth = 3). if unpausing, send back (depth = -3)
            let newDepth;
            if(!gamePaused){
                gamePaused = true;
                newDepth = 3;
            }
            else {
                gamePaused = false;
                newDepth = -3;
            }
            pauseFilter.depth = newDepth;
            pauseBG.depth = newDepth;
            pauseTitle.depth = newDepth;
        })

        //timed event: increasing boredom meter
        this.increaseBoredom = this.time.addEvent({
            delay: 100,
            callback: () => {
                if(!gamePaused && boredomRect.width < boredomBG.width){
                    if(radioOn){
                        boredomRect.width++;
                    }
                    else {
                        boredomRect.width+=2;
                    }
                }
            },
            loop: true
        });
    }
}