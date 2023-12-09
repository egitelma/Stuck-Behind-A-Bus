class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        //LOAD ANIMATIONS
        loadAnims(this);

        //ADD JSON
        const info = this.cache.json.get("dialogue");

        //VARIABLES
        let gloveboxOpen = false; //false for closed box, true for opened box
        let radioOn = true; //radio starts on
        let radioAngle = 0; //for now, this is only ever 0 or 180. two stations
        let gamePaused = false;
        let currentTrack = "track1";
        let zoomed = false;
        //  for camera purposes
        let carItems = []; 
        let UiItems = [];
        let pauseItems = [];
        //  to track what text is scrolling
        let phoneText = [];

        //MUSIC & SOUND
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
        let ambiance = this.sound.add("ambiance", {
            mute:false,
            volume: 1,
            loop: true
        }).play();

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
        carItems.push(radioGradient);
        //camera follower
        let camFollow = this.add.rectangle(carWidth/2, height/2, carWidth, height);
        //  car content
        let dashboard = this.add.image(0, 0, "dashboard").setOrigin(0);
        carItems.push(dashboard);
        let steeringWheel = this.add.sprite(174, 430, "steeringWheel").setInteractive({
            hitArea: this.add.circle(160, 252, 176),
            useHandCursor: true 
        });
        carItems.push(steeringWheel);
        let glovebox = this.add.sprite(635, 470, "glovebox").setOrigin(0).setInteractive({
            hitArea: gloveHitbox,
            useHandCursor: true
        });
        carItems.push(glovebox);
        let radioSwitch = this.add.sprite(456, 494, "radioSwitch").setOrigin(0).setInteractive({
            hitArea: radioGradient,
            useHandCursor: true
        });
        radioSwitch.depth = 1;
        carItems.push(radioSwitch);
        let radioDial = this.add.sprite(485, 480, "dial").setInteractive({
            hitArea: this.add.circle(485, 480, 11),
            useHandCursor: true
        });
        carItems.push(radioDial);
        let radioImg = this.add.sprite(431, 383, "track1_img").setOrigin(0);
        carItems.push(radioImg);
        //  progress items
        let burger = this.add.sprite(700, 285, "burger").setScale(0.75).setInteractive({
            useHandCursor: true
        })
        carItems.push(burger);
        // let burgerPath = this.add.path(carWidth/2, height/2);
        // burgerPath.lineTo(burger.x, burger.y);
        // burgerPath.closePath();
        // burgerPath.draw(graphics);

        //  outside the car
        let road = this.add.image(0, 0, "road").setOrigin(0);
        road.depth = -2;
        let bus = this.add.image(280, -100, "busBack").setOrigin(0).setScale(0.9);
        bus.depth = -2;

        //UI
        //general UI: should have boredom meter (background rect, filling rect, text) & pause
        let UI = {
            //boredom meter
            boredomBG: this.add.rectangle(5, 5, 200, 30, 0xFFFFFF).setOrigin(0),
            boredomRect: this.add.rectangle(5, 5, 0, 30, 0xFF0000).setOrigin(0),
            boredomText: this.add.dynamicBitmapText(5, 5, "subtitleFont", "boredom meter", 32).setOrigin(0),
            //pause button
            pause: this.add.sprite(carWidth-32, 32, "pause").setInteractive({
                useHandCursor: true
            })
        };
        UI.pause.depth = 3;
        //also an array of the subobjects for camera purposes
        for(let prop of Object.keys(UI)){
            UiItems.push(UI[prop]);
        }

        //pause menu UI: filter (shade over the screen), background white rect, "PAUSED title text, "back to menu" info button
        let pauseMenu = {
            pauseFilter: this.add.rectangle(carWidth/2, height/2, carWidth, height, 0x000000, .5),
            pauseBG: this.add.rectangle(carWidth/2, height/2, 450, 450, 0xFFFFFF),
            pauseTitle: this.add.dynamicBitmapText(carWidth/2, height/4, "subtitleFont", "PAUSED", 80).setOrigin(0.5),
            pauseInfo: this.add.dynamicBitmapText(carWidth/2, height/2, "titleFont", "back to menu", 32).setOrigin(0.5)
        }
        //again, an array of the subobjects for camera purposes
        for(let prop of Object.keys(pauseMenu)){
            pauseItems.push(pauseMenu[prop]);
            pauseMenu[prop].depth = -3;
        }

        //phone on the side UI
        graphics.fillStyle(0x000000);
        let phoneBorder = graphics.fillRoundedRect(carWidth, 0, width-carWidth, height, 30);
        graphics.fillStyle(0xFFFFFF);
        let phoneInner = graphics.fillRect(carWidth+30, 30, width-carWidth-60, height-60);

        //now that we've got all the objects in: camera config! (got a lot of it from Nathan's CameraLucida repo)
        this.cameras.main.setBounds(0, 0, width, height);
        this.cameras.main.ignore(UiItems, pauseItems);
        this.cameras.main.setViewport(0, 0, carWidth, height);
        this.cameras.main.startFollow(camFollow);
        //UI camera config
        this.UICamera = this.cameras.add(0, 0, carWidth, height);
        this.UICamera.ignore([road, bus].concat(pauseItems).concat(carItems))
        //pause camera config
        // this.pauseCamera = this.cameras.add(0, 0, carWidth, height);
        // this.pauseCamera.ignore([road, bus].concat(carItems).concat(UiItems));
        // this.cameras.remove(this.pauseCamera, false);
        //side text camera config
        this.textCamera = this.cameras.add(carWidth, 0, 320, height);
        this.textCamera.setBounds(carWidth, 0, width-carWidth, height);
        this.textCamera.setViewport(carWidth, 0, width-carWidth, height);

        //I drew the image first, then found the coordinates of the image in the drawing app. That's why they're so irregular.
        //635 587: bottom left
        //651 492: top left
        //931 470: top right
        //903 572: bottom right

        //EVENT HANDLING: on-click, timed

        //steering wheel interactivity
        steeringWheel.on("pointerdown", () => {
            this.addText(info.steering_wheel, phoneText);
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
            if(!radioOn) { //turn radio on
                eval(currentTrack).play();
                radioOn = true;
                radioSwitch.play("radio-off");
                radioImg.visible = true;
                //I have a weird error where the texture doesn't update if the radio is off, so this is my solution.
                radioImg.setTexture(currentTrack + "_img");
            }
            else { //turn radio off
                eval(currentTrack).stop();
                radioOn = false;
                radioSwitch.play("radio-on")
                radioImg.visible = false;
            }
        })
        radioDial.on("pointerdown", () => {
            //tween: twist radio dial 180 degrees
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
            //change track
            eval(currentTrack).stop();
            if(radioAngle == 0){ //dial facing up: "super spiffy" song
                currentTrack = "track1";
            }
            else {
                currentTrack = "track2";
            }
            if(radioOn){
                eval(currentTrack).play();
                radioImg.setTexture(currentTrack + "_img");
            }
        });

        //pausing/unpausing
        UI.pause.on("pointerdown", () => {
            //if pausing, bring menu forward (depth = 3). if unpausing, send back (depth = -3)
            let newDepth;
            if(!gamePaused){
                gamePaused = true;
                newDepth = 3;
                //stop the music!
                eval(currentTrack).pause();
                pauseMenu.pauseInfo.setInteractive({
                    useHandCursor: true
                })
                // this.cameras.remove(this.pauseCamera, false);
            }
            else {
                gamePaused = false;
                newDepth = -3;
                eval(currentTrack).resume();
                pauseMenu.pauseInfo.removeInteractive();
                // this.cameras.addExisting(this.pauseCamera);
            }
            for(let prop of Object.keys(pauseMenu)){
                pauseMenu[prop].depth = newDepth;
            }
        });

        //burger interactivity
        burger.on("pointerdown", () => {
            // let burgerStart = burgerPath.getStartPoint();
            // this.cameras.main.startFollow(burger)
            let zoomNum;
            //zoom out
            if(zoomed){
                zoomNum = 1;
                zoomed = false;
                burger.x = 700;
                burger.y = 285;
                //change pause menu size
                // for(let prop of Object.keys(pauseMenu)){
                //     pauseMenu[prop].setWidth(pauseMenu[prop].width*0.5);
                //     pauseMenu[prop].setHeight(pauseMenu[prop].height*0.5);
                // }
            }
            //zoom in: dialogue
            else {
                this.addText(info.burger_1, phoneText);
                zoomNum = 2;
                zoomed = true;
                burger.x = carWidth/2;
                burger.y = height/2;
                // for(let prop of Object.keys(pauseMenu)){
                //     pauseMenu[prop].setWidth(pauseMenu[prop].width*2);
                //     pauseMenu[prop].setHeight(pauseMenu[prop].height*2);
                // }
            }
            this.cameras.main.setZoom(zoomNum);
        });

        //menu button from pause menu
        pauseMenu.pauseInfo.on("pointerdown", () => {
            this.game.sound.stopAll();
            this.scene.start("menuScene");
        })

        //timed event: increasing boredom meter
        this.increaseBoredom = this.time.addEvent({
            delay: 100,
            callback: () => {
                if(!gamePaused && UI.boredomRect.width < UI.boredomBG.width && !zoomed){
                    if(radioOn){
                        UI.boredomRect.width++;
                    }
                    else {
                        UI.boredomRect.width+=2;
                    }
                }
                else if(UI.boredomRect.width >= UI.boredomBG.width){
                    this.game.sound.stopAll();
                    this.scene.start("gameOverScene");
                }
            },
            loop: true
        });

        //opening scene: explain how the game works & all that
    }

    addText(text, phoneText) {
        //adds text to phone screen
        //tween text upwards??
        //calculate the height of the text - how much we need to scoot everything else down
        let textHeight = this.getTextHeight(text);
        //then tween it to fit the new text
        for(let textBlock of phoneText){
            //to help with performance - don't tween if you're past the screen
            if (textBlock.y <= 640) {
                let newHeight = textBlock.y + textHeight;
                this.add.tween({
                    targets: textBlock,
                    paused: true,
                    yoyo: false,
                    y: {
                        from: textBlock.y,
                        to: newHeight,
                        duration: 100
                    }
                }).play();
            }
        }

        //add the new text to the array
        let newText = this.add.dynamicBitmapText(carWidth+40, 40, "textFont", text, 16)
        newText.maxWidth = 270;
        phoneText.push(newText);
    }

    getTextHeight(text){
        //specifically for text on phone screen
        /*pseudo:
            1) get string length
            2) divide string length by 23 (amount of letters that can fit per line, approx) -> store in variable
            3) round the variable up to the nearest whole number
            4) multiply by 25 (estimate for font size + line spacing) for total line space
        */
       let textLines = Math.ceil(text.length / 23);
       textLines *= 25;
       return textLines; //well that was easy
    }
}

//what to do in the car?
//sing, check mirror, daydream, text (phone in UI?)

//Thinking of creating a state machine to check which item is currently in focus, if any.