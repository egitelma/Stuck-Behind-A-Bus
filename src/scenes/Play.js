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
        let hungry = true;
        //  integers
        let radioAngle = 0; //for now, this is only ever 0 or 180. two stations
        let tutorialInt = 1;
        let currentHour = 6;
        let currentMinute = 0;
        let maxHour = 8; //we can only make it to 8 unless we entertain ourselves
        let sodaLevel = 5; //you can drink the soda five times
        //  strings
        let currentTrack = "track1";
        const tutorialString = "info.tutorial_"; //javascript immediately tell me to fuck off if i try to edit this plz
        //  arrays
        //      for camera purposes
        let carItems = []; 
        let UiItems = [];
        let pauseItems = [];
        //      to track what text is scrolling
        let phoneText = [];
        //      to track interactable items
        let interactables = [];

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
            volume: 1,
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

        //An interactable GameObject (with the exception of the pause button) should be contained within a larger object. The container object's format is as follows:
        /* {
            gameObject: the GameObject itself, initialized as NON-INTERACTABLE (but once the tutorial is over, becomes interactable)
            hitBool: whether the object has a custom hitbox
            hitbox: the custom hitbox.
            }
        */

        //HITBOXES
        //  a little out of place - radio switch gradient/hitbox must be defined separately
        graphics.fillGradientStyle(0x6ABE30, 0xAC3232, 0x6ABE30, 0xAC3232);
        let radioGradient = graphics.fillRect(456, 494, 57, 16);
        radioGradient.depth = -1;
        carItems.push(radioGradient);
        //  glovebox open/close hitboxes
        //      glovebox open
        let gloveboxOpenHitbox = this.add.rectangle(635, 533, 315, 54).setOrigin(0);
        //      glovebox closed
        let gloveboxClosedHitbox = this.add.rectangle(635, 470, 296, 117).setOrigin(0);
        //  soda hitboxes
        //      soda in glovebox
        let sodaUnfocusHitbox = this.add.rectangle(695, 510, 75, 38).setOrigin(0);
        //  the hitbox to default to when something is removed
        let trashHitbox = this.add.rectangle(-1000, -1000, 1, 1);

        //SET THE SCENE
        //  car content
        //      non-interactable: dashboard
        let dashboard = this.add.image(0, 0, "dashboard").setOrigin(0);
        carItems.push(dashboard);
        //      steering wheel
        let steeringWheel = {
            gameObject: this.add.sprite(174, 430, "steeringWheel"),
            hitBool: true,
            hitbox: this.add.circle(160, 252, 176, 0x000000, 0)
        };
        carItems.push(steeringWheel.gameObject);
        interactables.push(steeringWheel);
        //      glovebox
        let glovebox = {
            gameObject: this.add.sprite(635, 470, "glovebox").setOrigin(0),
            hitBool: true,
            hitbox: gloveboxClosedHitbox
            
        }
        carItems.push(glovebox.gameObject);
        interactables.push(glovebox);
        //      radio on/off switch
        let radioSwitch = {
            gameObject: this.add.sprite(456, 494, "radioSwitch", 7).setOrigin(0),
            hitBool: true,
            hitbox: radioGradient
        }
        radioSwitch.gameObject.depth = 1;
        carItems.push(radioSwitch.gameObject);
        interactables.push(radioSwitch);
        //      radio dial to change channel
        let radioDial = {
            gameObject: this.add.sprite(485, 480, "dial"),
            hitBool: true,
            hitbox: this.add.circle(485, 480, 11, 0x000000, 0)
        }
        carItems.push(radioDial.gameObject);
        interactables.push(radioDial);
        //      non-interactable: radio display
        let radioImg = this.add.sprite(431, 383, "track1_img").setOrigin(0);
        radioImg.visible = false;
        carItems.push(radioImg);
        //  progress items
        //      burger
        let burger = {
            gameObject: this.add.sprite(700, 285, "burger").setScale(0.75),
            hitBool: false
        }
        carItems.push(burger.gameObject);
        interactables.push(burger);
        //      soda
        let soda = {
            gameObject: this.add.sprite(-1000, -1000, "soda"),
            hitBool: true,
            hitbox: sodaUnfocusHitbox
        }

        //  outside the car
        //      road
        let road = this.add.image(0, 0, "road").setOrigin(0);
        road.depth = -2;
        //      bus
        let bus = this.add.image(280, -100, "busBack").setOrigin(0).setScale(0.9);
        bus.depth = -2;
        //      filter for how dark it is outside
        let outsideFilter = this.add.rectangle(0, 0, carWidth, height, 0x000000, 0.1).setOrigin(0);
        outsideFilter.depth = -2;

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

        //  pause menu UI: filter (shade over the screen), background white rect, "PAUSED title text, "back to menu" info button
        let pauseMenu = {
            pauseFilter: this.add.rectangle(carWidth/2, height/2, carWidth, height, 0x000000, .5),
            pauseBG: this.add.rectangle(carWidth/2, height/2, 450, 450, 0xFFFFFF),
            pauseTitle: this.add.dynamicBitmapText(carWidth/2, height/4, "subtitleFont", "PAUSED", 80).setOrigin(0.5),
            pauseInfo: this.add.dynamicBitmapText(carWidth/2, height/2, "titleFont", "back to menu", 32).setOrigin(0.5)
        }
        //      again, an array of the subobjects for camera purposes
        for(let prop of Object.keys(pauseMenu)){
            pauseItems.push(pauseMenu[prop]);
            pauseMenu[prop].depth = -3;
        }

        //  phone screen UI
        //      the actual interactable screen
        let phoneInteractable = {
            gameObject: this.add.sprite(carWidth, 0, "phoneScreen").setOrigin(0),
            hitBool: true,
            hitbox: this.add.rectangle(carWidth+30, 30, width-carWidth-60, height-60)
        }
        interactables.push(phoneInteractable);
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
        

        //now that we've got all the objects in: camera config! (got a lot of it from Nathan's CameraLucida repo)
        this.cameras.main.setBounds(0, 0, width, height);
        this.cameras.main.ignore(UiItems, pauseItems);
        this.cameras.main.setViewport(0, 0, carWidth, height);
        //UI camera config
        this.UICamera = this.cameras.add(0, 0, carWidth, height);
        this.UICamera.ignore([road, bus].concat(pauseItems).concat(carItems))
        //side text camera config
        this.textCamera = this.cameras.add(carWidth, 0, 320, height);
        this.textCamera.setBounds(carWidth, 0, width-carWidth, height);
        this.textCamera.setViewport(carWidth, 0, width-carWidth, height);

        //EVENT HANDLING
        //  on-click
        //      steering wheel interactivity
        steeringWheel.gameObject.on("pointerdown", () => {
            //  dialogue for interacting with steering wheel
            this.addText(info.steering_wheel, phoneText);
            //  jiggle the steering wheel a little
            this.tweens.add({
                targets: steeringWheel.gameObject,
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
        //      glovebox interactivity
        glovebox.gameObject.on("pointerdown", () => {
            if(!gloveboxOpen) {
                //open the glovebox
                gloveboxOpen = true;
                glovebox.gameObject.play("glovebox-open");
                gloveboxOpenSfx.play();
                //  alter its hitbox
                glovebox.hitbox = gloveboxOpenHitbox;
                glovebox.gameObject.removeInteractive();
                glovebox.gameObject.setInteractive({
                    hitArea: glovebox.hitbox,
                    useHandCursor: true
                });
            }
            else {
                //close the glovebox
                gloveboxOpen = false;
                glovebox.gameObject.play("glovebox-close");
                gloveboxCloseSfx.play();
                //  alter its hitbox
                glovebox.hitbox = gloveboxClosedHitbox;
            }
            //  set the actual hitbox rather than just changing the container object's attribute
            glovebox.gameObject.input.hitArea = glovebox.hitbox
            console.log(glovebox.hitbox);
            console.log(glovebox.gameObject.input.hitArea);
        })
        //      radio interactivity
        //          turn on/off with switch
        radioSwitch.gameObject.on("pointerdown", () => {
            if(!radioOn) { 
                //  turn radio on
                eval(currentTrack).play();
                radioOn = true;
                radioSwitch.gameObject.play("radio-off");
                radioImg.visible = true;
                //i have a weird error where the texture doesn't update if the radio is off, so set the texture when we turn on the radio instead
                radioImg.setTexture(currentTrack + "_img");
            }
            else { 
                //  turn radio off
                eval(currentTrack).stop();
                radioOn = false;
                radioSwitch.gameObject.play("radio-on")
                radioImg.visible = false;
            }

            if(!tutorialOver) {
                //  at the end of the tutorial, we need to:
                //      set tutorialOver to true
                tutorialOver = true;
                //      make all the interactable objects, interactable
                this.makeInteractable(interactables);
                UI.pause.setInteractive({
                    useHandCursor: true
                })
                //      unpause the game
                gamePaused = false;
            }
            
        })
        //          change radio station/spin dial
        radioDial.gameObject.on("pointerdown", () => {
            //tween: twist radio dial 180 degrees
            this.tweens.add({
                targets: radioDial.gameObject,
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
        //      burger interactivity
        burger.gameObject.on("pointerdown", () => {
            if(this.zoomed){
                //zoom out
                //  move burger to original position (700, 285)
                this.zoomObject(burger.gameObject, 700, 285);
                //  if hungry
                if (hungry) {
                    //  make sure we keep those thoughts between us and the burger
                    thoughtCloud.visible = false;
                    burgerEatText.visible = false;
                    //  eat the borger
                    hungry = false;
                    burgerSfx.play();
                    //  remove the burger from the player's view
                    burger.gameObject.setAlpha(0);
                    burger.hitBool = true;
                    burger.hitbox = trashHitbox;
                    //  and our functions: show dialogue, and reduce boredom meter
                    this.addText(info.burger_eaten, phoneText);
                    this.reduceBoredom(50, UI.boredomRect);
                    //  zoom out
                    this.cameras.main.setZoom(1);
                    this.zoomed = false;
                }
            }
            else {
                //zoom in
                //  move burger to center
                this.zoomObject(burger.gameObject);
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
            // this.cameras.main.setZoom(zoomNum);
        });
        //      soda interactivity
        soda.gameObject.on("pointerdown", () => {
            if(this.zoomed){
                //zoom out
                this.zoomObject(soda.gameObject, -1000, -1000); //get tossed in the Trash Zone
                console.log("soda zoom out");
            }
            else {
                //zoom in
                this.zoomObject(soda.gameObject);
                console.log("soda zoom in");
            }
        });

        //      pausing/unpausing
        UI.pause.on("pointerdown", () => {
            //if pausing, bring menu forward (depth = 3). if unpausing, send back (depth = -3)
            let newDepth;
            if(!gamePaused){ 
                //pause game
                gamePaused = true;
                newDepth = 3;
                //  stop the music!
                eval(currentTrack).pause();
                //  make "go back to title" button clickable
                pauseMenu.pauseInfo.setInteractive({
                    useHandCursor: true
                })
                //  make all interactable game objects unclickable
                this.removeInteractable(interactables);
            }
            else { 
                //unpause game
                gamePaused = false;
                newDepth = -3;
                //  start the music!
                eval(currentTrack).resume();
                //  remove "go back to title" button
                pauseMenu.pauseInfo.removeInteractive();
                //  make all interactable game objects clickable
                this.makeInteractable(interactables);
            }
            //pause menu: move to front (3) or back (-3)
            for(let prop of Object.keys(pauseMenu)){
                pauseMenu[prop].depth = newDepth;
            }
        });

        //      "back to title" button from pause menu
        pauseMenu.pauseInfo.on("pointerdown", () => {
            //  we just need to stop sound and go back
            this.game.sound.stopAll();
            this.scene.start("menuScene");
        })

        //      phone screen
        phoneInteractable.gameObject.on("pointerdown", () => {
            //tutorial progression
            if(!tutorialOver) {
                //  increase tutorialInt to change the dialogue we're showing
                tutorialInt++;
                if(tutorialInt > 5) {
                    //  now we need to start ending the tutorial
                    //      make radio on/off switch clickable
                    radioSwitch.gameObject.setInteractive({
                        hitArea: radioSwitch.hitbox,
                        useHandCursor: true
                    })
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
            delay: 1000,
            callback: () => {
                if(!gamePaused) {
                    currentMinute++;
                    let minute = currentMinute;
                    if(currentMinute == 60) {
                        //  when an hour passes, increase the hour
                        currentHour++;
                        currentMinute = 0;
                        minute = "00";
                        //  also, it should get a little darker
                        outsideFilter.setAlpha(outsideFilter.alpha + 0.1);
                        //  progression event: get hungry after an hour
                        if(currentHour == 7){
                            this.addText(info.hungry, phoneText);
                            hungry = true;
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
                else if(UI.boredomRect.width >= UI.boredomBG.width){
                    //oh no! we've lost the game (exceeded boredom meter). stop the music and switch scenes
                    this.game.sound.stopAll();
                    this.scene.start("gameOverScene");
                }
            },
            loop: true
        });
        //      wait a moment before starting the tutorial dialogue, to draw the player's attention
        this.time.addEvent({
            delay: 800,
            callback: () => {
                //  set phone screen to clickable 
                phoneInteractable.gameObject.setInteractive({
                    hitArea: phoneInteractable.hitbox,
                    useHandCursor: true
                });
                //  run first dialogue box
                //      tutorialInt is an integer (1-5) that tracks what dialogue box we're on.
                //      tutorialString is "info.tutorial_"
                //      json is formatted like: info.tutorial_1
                //      pass into this.addText(info.tutorial_x, phoneText)
                //      so, we need to append tutorialInt to tutorialString and evaluate it
                this.addText(eval(tutorialString + tutorialInt), phoneText);
            },
            loop: false
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
    //  parameters:
    //      interactables - an array of container objects with the format:
    /* 
        {
            gameObject: the GameObject itself
            hitBool: whether the object has a custom hitbox
            hitbox: the custom hitbox
        }
    */
    makeInteractable(interactables){
        for(let item of interactables) {
            if (item.hitBool){
                //  has a custom hitbox
                item.gameObject.setInteractive({
                    hitArea: item.hitbox,
                    useHandCursor: true
                });
            }
            else {
                //  no custom hitbox
                item.gameObject.setInteractive({
                    useHandCursor: true
                });
            }
        }
    }

    //  remove interactivity of all objects (for pause toggling)
    //  parameters:
    //      see the comment above makeInteractable
    removeInteractable(interactables) {
        //this is much shorter, but for organization it's an external function
        for(let item of interactables) {
            item.gameObject.removeInteractive();
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
            boredomMeter -= reductionValue;
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