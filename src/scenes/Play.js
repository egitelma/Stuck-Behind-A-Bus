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
        let currentTrack = "track1";
        let zoomed = false;

        //MUSIC
        let track1 = this.sound.add("track1", {
            mute: false,
            volume: 0.5,
            loop: true
        });
        let track2 = this.sound.add("track2", {
            mute: false,
            volume: 0.5,
            loop: true
        });
        track1.play();

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
        let dashboard = this.add.image(0, 0, "dashboard").setOrigin(0);
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
        let burger = this.add.sprite(700, 285, "burger").setScale(0.25).setInteractive({
            useHandCursor: true
        })
        let burgerPath = this.add.path(width/2, height/2);
        burgerPath.lineTo(burger.x, burger.y);
        burgerPath.closePath();
        burgerPath.draw(graphics);

        //  outside the car
        let road = this.add.image(0, 0, "road").setOrigin(0);
        road.depth = -2

        //UI
        let UI = [];
        //boredom meter
        const boredomBG = this.add.rectangle(5, 5, 200, 30, 0xFFFFFF).setOrigin(0);
        let boredomRect = this.add.rectangle(5, 5, 10, 30, 0xFF0000).setOrigin(0);
        let boredomText = this.add.dynamicBitmapText(5, 5, "subtitleFont", "boredom meter", 32).setOrigin(0);
        //pause button
        let pause = this.add.sprite(width-32, 32, "pause").setInteractive({
            useHandCursor: true
        })
        pause.depth = 3;
        //create pause menu
        let pauseFilter = this.add.rectangle(0, 0, width, height, 0x000000, .5).setOrigin(0);
        let pauseBG = this.add.rectangle(width/2, height/2, 450, 450, 0xFFFFFF);
        let pauseTitle = this.add.dynamicBitmapText(width/2, height/4, "subtitleFont", "PAUSED", 80).setOrigin(0.5);
        let pauseInfo = this.add.dynamicBitmapText(width/2, height/2, "titleFont", "back to menu", 32).setOrigin(0.5);
        pauseInfo.setInteractive({
            useHandCursor: true
        })
        pauseFilter.depth = -3;
        pauseBG.depth = -3;
        pauseTitle.depth = -3;
        pauseInfo.depth = -3;

        //camera config (got from Nathan's CameraLucida repo)
        this.cameras.main.setBounds(0, 0, width, height);
        this.cameras.main.setZoom(1);
        this.cameras.main.ignore([boredomBG, boredomRect, boredomText]);
        // this.cameras.main.ignore([pauseBG, pauseFilter, pauseTitle, boredomBG, boredomRect, pause]);
        //UI camera config
        this.UICamera = this.cameras.add(0, 0, width, height);
        this.UICamera.ignore([dashboard, radioGradient, steeringWheel, glovebox, radioSwitch, radioDial, burger, road, pauseBG, pauseFilter, pauseTitle, pauseInfo])
        //pause camera config
        // this.pauseCamera = this.cameras.add(0, 0, width, height);
        // this.pauseCamera.ignore([dashboard, radioGradient, steeringWheel, glovebox, radioSwitch, radioDial, burger, road, boredomBG, boredomRect]);
        // this.UICamera.ignore([dashboard, radioGradient, steeringWheel, glovebox, radioSwitch, radioDial, burger, road]);
        
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
                eval(currentTrack).play();
                radioOn = true;
                radioSwitch.play("radio-off");
            }
            else {
                eval(currentTrack).stop();
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
            eval(currentTrack).stop();
            if(radioAngle == 0){
                currentTrack = "track1";
            }
            else {
                currentTrack = "track2";
            }
            if(radioOn){
                eval(currentTrack).play();
            }
        });

        //pausing/unpausing
        pause.on("pointerdown", () => {
            //if pausing, bring menu forward (depth = 3). if unpausing, send back (depth = -3)
            let newDepth;
            if(!gamePaused){
                gamePaused = true;
                newDepth = 3;
                //stop the music!
                eval(currentTrack).pause();
            }
            else {
                gamePaused = false;
                newDepth = -3;
                eval(currentTrack).resume();
            }
            pauseFilter.depth = newDepth;
            pauseBG.depth = newDepth;
            pauseTitle.depth = newDepth;
            pauseInfo.depth = newDepth;
        });

        burger.on("pointerdown", () => {
            console.log("burger click!");
            let burgerStart = burgerPath.getStartPoint();
            console.log(burgerStart);
            console.log(burgerPath);
            // this.cameras.main.startFollow(burger)
            let zoomNum;
            if(zoomed){
                zoomNum = 1;
                zoomed = false;
                burger.x = 700;
                burger.y = 285;
            }
            else {
                zoomNum = 2;
                zoomed = true;
                burger.x = width/2;
                burger.y = height/2;
            }
            this.cameras.main.setZoom(zoomNum);
        });

        //menu button from pause menu
        pauseInfo.on("pointerdown", () => {
            eval(currentTrack).stop();
            this.scene.start("menuScene");
        })

        //timed event: increasing boredom meter
        this.increaseBoredom = this.time.addEvent({
            delay: 100,
            callback: () => {
                if(!gamePaused && boredomRect.width < boredomBG.width && !zoomed){
                    if(radioOn){
                        boredomRect.width++;
                    }
                    else {
                        boredomRect.width+=2;
                    }
                }
                else if(boredomRect.width >= boredomBG.width){
                    eval(currentTrack).stop();
                    this.scene.start("gameOverScene");
                }
            },
            loop: true
        });
    }
}

//what to do in the car?
//sing, check mirror, daydream, text (phone in UI?)

//Thinking of creating a state machine to check which item is currently in focus, if any.