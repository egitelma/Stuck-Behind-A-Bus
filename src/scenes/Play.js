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
        //  graphics
        const graphics = this.add.graphics();
        //  booleans
        let gamePaused = true; //game starts paused, nothing is running, so we can do the tutorial
        let gloveboxOpen = false; //false for closed box, true for opened box
        let radioOn = false; //radio starts off
        this.zoomed = false; //we're zoomed out to start
        let tutorialOver = false;
        let gameOver = false;
        let hungry = false;
        //  integers
        let radioAngle = 0; //for now, this is only ever 0 or 180. two stations
        let tutorialInt = 1;
        let gameOverInt = 1;
        let gameWonInt = 1;
        let currentHour = 6; //start at 6:00
        let currentMinute = 0;
        let maxHour = 8; //we can only make it to 8 unless we entertain ourselves
        let sodaLevel = 5; //you can drink the soda five times [insert donkey kong meme]
        //  strings
        let currentTrack = "track1";
        const tutorialString = "info.tutorial_"; //javascript immediately tell me to fuck off if i try to edit this plz
        const gameOverString = "info.gameover_";
        const gameWonString = "info.gamewin_";
        //  arrays
        //      for camera purposes
        let carItems = []; 
        let UiItems = [];
        //      to track what text is scrolling
        let phoneText = [];
        //      to track interactable items
        this.interactables = [];

        //AUDIO
        //  music
        //      track 1: "super spiffy"
        let track1 = this.sound.add("track1", {
            mute: false,
            volume: 0.5,
            loop: true
        });
        //      track 2: "prairie evening"
        let track2 = this.sound.add("track2", {
            mute: false,
            volume: 0.5,
            loop: true
        });
        //  sfx
        //      car ambiance
        let ambiance = this.sound.add("ambiance", {
            mute:false,
            volume: 0.75,
            loop: true
        }).play();
        //      burger eating
        let burgerSfx = this.sound.add("burgerEat", {
            mute: false,
            volume: 1,
            loop: false
        });
        //      soda drink
        let sodaSfx = this.sound.add("sodaDrink", {
            mute: false,
            volume: 2,
            loop: false
        });
        //      open glovebox
        let gloveboxOpenSfx = this.sound.add("openGlovebox", {
            mute: false,
            volume: 1,
            loop: false
        });
        //      close glovebox
        let gloveboxCloseSfx = this.sound.add("closeGlovebox", {
            mute: false,
            volume: 1,
            loop: false
        });
        let switchSfx = this.sound.add("clickSwitch", {
            mute: false,
            volume: 1,
            loop: false
        });

        //HITBOXES
        //  a little out of place - radio switch gradient/hitbox must be defined separately
        graphics.fillGradientStyle(0x6ABE30, 0xAC3232, 0x6ABE30, 0xAC3232);
        let radioGradient = graphics.fillRect(456, 494, 57, 16);
        radioGradient.depth = -1;
        carItems.push(radioGradient);

        //SET THE SCENE
        //  car content
        //      non-interactable: dashboard
        let dashboard = this.add.image(0, 0, "dashboard").setOrigin(0);
        carItems.push(dashboard);
        //      steering wheel
        let steeringWheel = this.add.sprite(174, 430, "steeringWheel");
        carItems.push(steeringWheel);
        this.interactables.push(steeringWheel);
        //      glovebox
        //          main glovebox
        let glovebox = this.add.sprite(635, 470, "glovebox").setOrigin(0);
        carItems.push(glovebox);
        this.interactables.push(glovebox);
        //          glovebox opened lid
        let gloveboxLid = this.add.sprite(-1000, -1000, "glovebox").setFrame(6).setOrigin(0);
        gloveboxLid.depth = 1;
        carItems.push(gloveboxLid);
        this.interactables.push(gloveboxLid);
        //      radio on/off switch
        let radioSwitch = this.add.sprite(456, 494, "radioSwitch", 7).setOrigin(0)
        radioSwitch.depth = 1;
        carItems.push(radioSwitch);
        this.interactables.push(radioSwitch);
        //      radio dial to change channel
        let radioDial = this.add.sprite(485, 480, "dial")
        carItems.push(radioDial);
        this.interactables.push(radioDial);
        //      non-interactable: radio display
        let radioImg = this.add.sprite(431, 383, "track1_img").setOrigin(0);
        radioImg.visible = false;
        carItems.push(radioImg);
        //  progress items
        //      burger
        let burger = this.add.sprite(700, 285, "burger").setScale(0.75);
        carItems.push(burger);
        this.interactables.push(burger);
        //      soda
        let soda = this.add.sprite(-1000, -1000, "soda", 1);
        carItems.push(soda);
        this.interactables.push(soda);
        //  outside the car
        //      road
        let road = this.add.sprite(0, 0, "road").setOrigin(0);
        road.depth = -2;
        //      bus
        let bus = this.add.image(500, 10, "busBack").setOrigin(0.5, 0.25).setScale(0.9);
        bus.depth = -2;

        //UI
        //  general UI: should have boredom meter (background rect, filling rect, text) & pause
        let UI = {
            //boredom meter
            boredomBG: this.add.rectangle(5, 5, 200, 30, 0xFFFFFF).setOrigin(0),
            boredomRect: this.add.rectangle(5, 5, 0, 30, 0xFF0000).setOrigin(0),
            boredomText: this.add.dynamicBitmapText(5, 5, "subtitleFont", "boredom meter", 32).setOrigin(0),
            //pause button
            pause: this.add.sprite(carWidth-32, 32, "pause")
        };
        UI.pause.depth = 3;
        //      also an array of the subobjects for camera purposes
        for(let prop of Object.keys(UI)){
            UiItems.push(UI[prop]);
        }
        //  phone screen UI
        //      the actual interactable screen
        let phoneInteractable = this.add.sprite(carWidth, 0, "phoneScreen").setOrigin(0)
        phoneInteractable.depth = 1;
        this.interactables.push(phoneInteractable);
        //      shaded rectangle for the time: top left is (15, 28)
        this.add.rectangle(carWidth+15, 28, 290, 20, 0x000000, 0.5).setOrigin(0);
        //      the actual time
        let clockTime = this.add.text(carWidth+15, 28, currentHour + ":0" + currentMinute, {
            fontFamily: "Courier New", //i'm so tired of bitmap fonts
            fontSize: "13px",
            color: "#FFFFFF",
            align: "left",
            padding: {
                top: 5,
                left: 5
            }
        })

        //  interactable objects UI: text that appears when objects are able to be consumed
        //      The Cloud: background for the text
        let thoughtCloud = this.add.image(carWidth/2, height/2+150, "thoughtCloud").setScale(2);
        thoughtCloud.visible = false;
        UiItems.push(thoughtCloud);
        //      borger
        let burgerEatText = this.add.dynamicBitmapText(carWidth/2, height/2+150, "subtitleFont", "click to eat", 32).setOrigin(0.5);
        burgerEatText.visible = false;
        UiItems.push(burgerEatText);
        //      soda
        let sodaDrinkText = this.add.dynamicBitmapText(carWidth/2, height/2+150, "subtitleFont", "click to drink", 32).setOrigin(0.5);
        sodaDrinkText.visible = false;
        UiItems.push(sodaDrinkText);

        //CAMERAS
        this.cameras.main.setBounds(0, 0, width, height);
        this.cameras.main.ignore(UiItems);
        this.cameras.main.setViewport(0, 0, carWidth, height);
        //  UI camera
        this.UICamera = this.cameras.add(0, 0, carWidth, height);
        this.UICamera.ignore([road, bus].concat(carItems))
        //  phone camera
        this.textCamera = this.cameras.add(carWidth, 0, 320, height);
        this.textCamera.setBounds(carWidth, 0, width-carWidth, height);
        this.textCamera.setViewport(carWidth, 0, width-carWidth, height);

        //EVENT HANDLING (this is so long. i tried my best to make it as organized as possible. i suggest minimizing areas you're not looking at, if you're able)
        //  pointer events
        //      steering wheel
        //          on-click
        steeringWheel.on("pointerdown", () => {
            //  dialogue for interacting with steering wheel
            this.addText(info.steering_wheel, phoneText);
            //  reduce a teeny bit of boredom
            this.reduceBoredom(5, UI.boredomRect);
            //  jiggle the steering wheel a little
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
        //          on-hover
        steeringWheel.on("pointerover", () => {
            //  set to frame 1 - white outline
            steeringWheel.setFrame(1);
        })
        //          out-of-hover
        steeringWheel.on("pointerout", () => {
            //  put it back to normal
            steeringWheel.setFrame(0);
        })
        //      glovebox
        //          on-click
        //              closed glovebox
        glovebox.on("pointerdown", () => {
            //  open the glovebox
            gloveboxOpen = true;
            glovebox.play("glovebox-open");
            gloveboxOpenSfx.play();
            glovebox.removeInteractive();
            //  move the soda interactable in there (and wait a little, else it looks weird)
            //  oh yeah, and the glovebox lid interactable too
            this.time.addEvent({
                delay: 250, // 16 fps, 4 frames, so it's a quarter of a second
                callback: () => {
                    //  just scoot the soda into the right place
                    soda.setX(733);
                    soda.setY(530);
                    //  and the glovebox interactable, too
                    gloveboxLid.setX(635);
                    gloveboxLid.setY(471);
                },
                loop: false
            })
            
        })
        //              opened glovebox
        gloveboxLid.on("pointerdown", () => {
            //  close the glovebox
            gloveboxOpen = false;
            glovebox.play("glovebox-close");
            gloveboxCloseSfx.play();
            //  make the glovebox interactable again
            glovebox.setInteractive(this.input.makePixelPerfect());
            //  send the interactables to limbo
            //      soda
            soda.setX(-1000);
            soda.setY(-1000);
            //      glovebox lid
            gloveboxLid.setX(-1000);
            gloveboxLid.setY(-1000); //i know i don't actually have to set both x and y, but it just feels nicer to me, the picky programmer
        })
        //          on-hover
        //              closed glovebox
        glovebox.on("pointerover", () => {
            //  set to frame 4 - white outline of closed glovebox
            glovebox.setFrame(4);
        })
        //              opened glovebox
        gloveboxLid.on("pointerover", () => {
            //  set to frame 5 - white outline of open glovebox
            gloveboxLid.setFrame(5);
        })
        //          out-of-hover
        //              closed glovebox
        glovebox.on("pointerout", () => {
            //  back to normal
            glovebox.setFrame(0);
        })
        //              opened glovebox
        gloveboxLid.on("pointerout", () => {
            //  back to normal - is frame 6 because of when i made it lolol
            gloveboxLid.setFrame(6)
        })
        //      radio switch
        //          on-click
        radioSwitch.on("pointerdown", () => {
            //  play sfx
            switchSfx.play();
            if(!radioOn) { 
                //  turn radio on
                eval(currentTrack).play();
                radioOn = true;
                radioSwitch.play("radio-off");
                radioImg.visible = true;
                //i have a weird error where the texture doesn't update if the radio is off, so set the texture when we turn on the radio instead
                radioImg.setTexture(currentTrack + "_img");
            }
            else { 
                //  turn radio off
                eval(currentTrack).stop();
                radioOn = false;
                radioSwitch.play("radio-on")
                radioImg.visible = false;
            }

            if(!tutorialOver) {
                //  at the end of the tutorial, we need to:
                //      set tutorialOver to true
                tutorialOver = true;
                //      make all the interactable objects, interactable
                this.makeInteractable();
                UI.pause.setInteractive({
                    useHandCursor: true
                })
                //      unpause the game
                gamePaused = false;
            }
            
        })
        //          on-hover
        radioSwitch.on("pointerover", () => {
            //  set to frame 8 if on, or 9 if off - white outline
            if(radioOn) {
                radioSwitch.setFrame(8);
            }
            else {
                radioSwitch.setFrame(9);
            }
        })
        //          out-of-hover
        radioSwitch.on("pointerout", () => {
            //  set back to normal
            if(radioOn) {
                radioSwitch.setFrame(0);
            }
            else {
                radioSwitch.setFrame(7);
            }
        })
        //      radio dial
        //          on-click
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
            if(radioAngle == 0){ 
                //  dial facing up: "super spiffy" song
                currentTrack = "track1";
            }
            else {
                //  dial facing down: "prairie evening" song
                currentTrack = "track2";
            }
            if(radioOn){
                //  we only play the song if the radio is on, of course
                eval(currentTrack).play();
                radioImg.setTexture(currentTrack + "_img");
            }
        });
        //          on-hover
        radioDial.on("pointerover", () => {
            //  set to frame 1 - white outline
            radioDial.setFrame(1);
        })
        //          out-of-hover
        radioDial.on("pointerout", () => {
            //  put it back to normal
            radioDial.setFrame(0);
        })
        //      burger
        //          on-click
        burger.on("pointerdown", () => {
            if(this.zoomed){
                //zoom out
                //  move burger to original position (700, 285)
                this.zoomObject(burger, 700, 285);
                //  if hungry
                if (hungry) {
                    //  make sure we keep those thoughts between us and the burger
                    thoughtCloud.visible = false;
                    burgerEatText.visible = false;
                    //  eat the borger
                    hungry = false;
                    burgerSfx.play();
                    //  remove the burger from the player's view
                    burger.setX(-1000);
                    burger.setY(-1000);
                    //  and our functions: show dialogue, and reduce boredom meter
                    this.addText(info.burger_eaten, phoneText);
                    this.reduceBoredom(50, UI.boredomRect);
                    //  we can also wait longer now
                    maxHour++;
                    //  zoom out
                    this.cameras.main.setZoom(1);
                    this.zoomed = false;
                }
            }
            else {
                //zoom in
                //  move burger to center
                this.zoomObject(burger);
                //  if not hungry
                if(!hungry){
                    //  just run dialogue
                    this.addText(info.burger_1, phoneText);
                }
                //  if hungry
                else {
                    //  hungry dialogue
                    this.addText(info.burger_2, phoneText);
                    //  show our thoughts: click to eat
                    thoughtCloud.visible = true;
                    burgerEatText.visible = true;
                }
            }
        });
        //          on-hover
        burger.on("pointerover", () => {
            //  set to frame 1 - white outline
            burger.setFrame(1);
        })
        //          out-of-hover
        burger.on("pointerout", () => {
            //  set back to normal
            burger.setFrame(0);
        })
        //      soda
        //          on-click
        soda.on("pointerdown", () => {
            if(this.zoomed) {
                //zoom out (& change texture back to side-lying soda)
                soda.setFrame(1);
                this.zoomObject(soda, 733, 530);
                //  make the burger interactive again
                burger.setInteractive(this.input.makePixelPerfect());
                if(sodaLevel > 0) {
                    //  gulp
                    sodaSfx.play();
                    //  reduce amount of soda in the can
                    sodaLevel--;
                    //  our external functions
                    this.reduceBoredom(30, UI.boredomRect);
                    //  can we still drink from it? show text
                    let showText;
                    if(sodaLevel == 0) {
                        showText = info.soda_drank;
                    }
                    else {
                        showText = info.soda_drinking;
                    }
                    this.addText(showText, phoneText);
                }
                //  again, make sure to keep those thoughts between us and the burger
                thoughtCloud.visible = false;
                sodaDrinkText.visible = false;
            }
            else {
                //zoom in
                soda.setFrame(0);
                this.zoomObject(soda);
                //  remove burger interactivity bc it breaks everything
                burger.removeInteractive();
                switch(sodaLevel) {
                    //  soda is full
                    case 5:
                        this.addText(info.soda_1, phoneText);
                        //  show instructions as well
                        thoughtCloud.visible = true;
                        sodaDrinkText.visible = true;
                        break;
                    //  soda is empty
                    case 0:
                        this.addText(info.soda_3, phoneText);
                        break;
                    //  drinky :)
                    default:
                        this.addText(info.soda_2, phoneText);
                        //  show instructions as well
                        thoughtCloud.visible = true;
                        sodaDrinkText.visible = true;
                }
            }
        });
        //          on-hover
        soda.on("pointerover", () => {
            if(this.zoomed) {
                soda.setFrame(2);
            }
            else {
                soda.setFrame(3);
            }
        })
        //          out-of-hover
        soda.on("pointerout", () => {
            if(this.zoomed) {
                soda.setFrame(0);
            }
            else {
                soda.setFrame(1);
            }
        })
        //      pause button
        UI.pause.on("pointerdown", () => {
            //if pausing, launch scene without pausing our current scene. if unpausing, stop it
            if(!gamePaused){ 
                //pause game
                gamePaused = true;
                //  stop the music!
                eval(currentTrack).pause();
                //  make all interactable game objects unclickable
                this.removeInteractable();
                //  launch new scene over the top
                this.scene.launch("pauseScene")
            }
            else { 
                //unpause game
                gamePaused = false;
                //  start the music!
                eval(currentTrack).resume();
                //  make all interactable game objects clickable
                this.makeInteractable();
                //  stop pause scene
                this.scene.stop("pauseScene");
            }
        });
        //      phone screen
        phoneInteractable.on("pointerdown", () => {
            //tutorial progression
            if(!tutorialOver) {
                //  increase tutorialInt to change the dialogue we're showing
                tutorialInt++;
                if(tutorialInt > 5) {
                    //  now we need to start ending the tutorial
                    //      make radio on/off switch clickable
                    radioSwitch.setInteractive(this.input.makePixelPerfect())
                }
                else {
                    //  run dialogue on click until the last dialogue is reached
                    this.addText(eval(tutorialString + tutorialInt), phoneText);
                }
            }
        })   

        //  timed
        //      increasing the actual clock time
        this.increaseClock = this.time.addEvent({
            delay: 500, // was originally 1000, so, 1 minute in-game = 1 second real-time, but god that takes forever
            callback: () => {
                if(!gamePaused) {
                    currentMinute++;
                    let minute = currentMinute;
                    if(currentMinute == 60) {
                        //  when an hour passes, increase the hour
                        currentHour++;
                        currentMinute = 0;
                        minute = "00";
                        //  progression event: get hungry after an hour
                        if(currentHour == 7){
                            this.addText(info.hungry, phoneText);
                            hungry = true;
                        }
                        //  end the game: my downward spiral begins
                        if(currentHour == maxHour) {
                            gameOver = true;
                            gamePaused = true;
                            //  lose game
                            if(hungry) {
                                //  if you're hungry still, then you go crazy :( very sad. rip. etc.
                                gameWon = false;
                                //  remove interactivity
                                this.removeInteractable();
                                UI.pause.removeInteractive();
                                endBadDialogue.paused = false;
                            }
                            //  win game
                            else if(maxHour == 9) {
                                //  we win!!! yippee!!
                                gameWon = true;
                                //  we can't interact with anything else though
                                this.removeInteractable();
                                UI.pause.removeInteractive();
                                //  tween the bus, move the road
                                let busTween = this.tweens.add({
                                    targets: bus,
                                    paused: false,
                                    yoyo: false,
                                    scale: {
                                        from: bus.scale,
                                        to: bus.scale/4,
                                        duration: 10000
                                    },
                                    y: {
                                        from: bus.y,
                                        to: bus.y-50
                                    }
                                })
                                road.play("road-move");
                                //  timed event - end dialogue
                                endGoodDialogue.paused = false;
                            }
                        }
                    }
                    else if(currentMinute < 10) {
                        minute = "0" + currentMinute;
                    }
                    clockTime.setText(currentHour + ":" + minute);
                }
            },
            loop: true
        })
        //      increasing boredom meter
        this.increaseBoredom = this.time.addEvent({
            delay: 300,
            callback: () => {
                if(!gamePaused && UI.boredomRect.width < UI.boredomBG.width && !this.zoomed){
                    //if game is: not paused, not zoomed in, and we haven't already exceeded the boredom meter
                    //  we get bored faster if there's no music playing
                    if(radioOn){
                        UI.boredomRect.width++;
                    }
                    else {
                        UI.boredomRect.width+=2;
                    }
                }
                //  lose game
                else if(UI.boredomRect.width >= UI.boredomBG.width){
                    gameWon = false;
                    //oh no! we've lost the game (exceeded boredom meter). stop the music and switch scenes
                    //  scene transition
                    //  remove interactivity
                    this.removeInteractable();
                    UI.pause.removeInteractive();
                    endBadDialogue.paused = false;
                }
            },
            loop: true
        });
        //      wait a moment before starting the tutorial dialogue, to draw the player's attention
        this.time.addEvent({
            delay: 800,
            callback: () => {
                //  set phone screen to clickable 
                phoneInteractable.setInteractive({
                    useHandCursor: true
                });
                //  run first dialogue box
                //      tutorialInt is an integer (1-5) that tracks what dialogue box we're on.
                //      tutorialString is "info.tutorial_"
                this.addText(eval(tutorialString + tutorialInt), phoneText);
            },
            loop: false
        })

        //      end dialogue
        //          bad end
        let endBadDialogue = this.time.addEvent({
            delay: 2000,
            callback: () => {
                if(gameOverInt > 3){
                    //  scene transition to GAME WON screen
                    this.scene.transition({
                        allowInput: false,
                        target: "gameOverScene",
                        duration: 2000,
                        onStart: () => {
                            this.game.sound.stopAll();
                            this.cameras.main.fadeOut(2000, 255, 255, 255);
                        }
                    })
                }
                else {
                    this.addText(eval(gameOverString + gameOverInt), phoneText);
                    gameOverInt++;
                }
            },
            loop: true,
            paused: true
        })
        //          good end
        let endGoodDialogue = this.time.addEvent({
            delay: 2000,
            callback: () => {
                if(gameWonInt < 5){
                    this.addText(eval(gameWonString + gameWonInt), phoneText);
                    gameWonInt++;
                }
                else {
                    //  scene transition to GAME WON screen
                    this.scene.transition({
                        allowInput: false,
                        target: "gameOverScene",
                        duration: 2000,
                        onStart: () => {
                            this.game.sound.stopAll();
                            this.cameras.main.fadeOut(2000, 255, 255, 255);
                        }
                    })
                }
            },
            loop: true,
            paused: true
        })

    } // **END CREATE**


    //EXTERNAL FUNCTIONS

    //  get height of text in order to scroll properly
    //  parameters:
    //      text - a string taken from info.json whose height is going to be calculated
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

    //  add text to phone screen
    //  parameters:
    //      text - a string taken from info.json, containing the text to be added to the phone screen
    //      phoneText - an array of strings that are already present on the phone screen
    addText(text, phoneText) {
        //adds text to phone screen
        //  calculate the height of the text - how much we need to scoot everything else down
        let textHeight = this.getTextHeight(text);
        //  then tween it to fit the new text
        for(let textBlock of phoneText){
            //  to help with performance - don't tween if you're past the screen
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
        //  add the new text to the array
        let newText = this.add.dynamicBitmapText(carWidth+35, 65, "textFont", text, 16)
        newText.maxWidth = 260;
        phoneText.push(newText);
    }

    //  make all interactable objects interactable (for pause toggling & end of tutorial)
    makeInteractable(){
        for(let item of this.interactables) {
            item.setInteractive(this.input.makePixelPerfect());
        }
    }

    //  remove interactivity of all objects (for pause toggling)
    removeInteractable() {
        //this is much shorter, but for organization it's an external function
        for(let item of this.interactables) {
            item.removeInteractive();
        }
    }

    //  shrink boredom meter a specified amount
    //  parameters:
    //      reductionValue - an integer defining how much to remove from the boredom bar
    //      boredomMeter - the actual meter to reduce the width from
    reduceBoredom(reductionValue, boredomMeter){
        //  if the boredom meter is too low, just set it to 0
        if (boredomMeter.width-reductionValue < 0) {
            boredomMeter.width = 0;
        }
        //  or else we just reduce it by the value (shrug)
        else {
            boredomMeter.width -= reductionValue;
        }
    }

    //  zoom in or out, bring game object into focus or move it out of it
    //  parameters:
    //      gameObj - the game object to move
    //      newX - optional parameter, the X value to move the object to (default carWidth/2)
    //      newY - optional parameter, the Y value to move the object to (default height/2)
    zoomObject(gameObj, newX=carWidth/2, newY=height/2){
        //  check this.zoomed, it will show whether we are zooming in (value: false) or out (value: true)
        let zoomNum;
        if(!this.zoomed){
            //  zoom in
            zoomNum = 2;
            this.zoomed = true;
        }
        else {
            //  zoom out
            zoomNum = 1;
            this.zoomed = false;
        }
        this.cameras.main.setZoom(zoomNum);
        gameObj.x = newX;
        gameObj.y = newY;
    }
} // **END CLASS**

//what to do in the car?
//sing, check mirror, daydream, text (phone in UI?)

//Thinking of creating a state machine to check which item is currently in focus, if any.
//I want to implement a basic sound control slider.
//Also, interactable objects should have a white border around them when hovered over.