let config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 640,
    render: {
        pixelArt: true
    },
    scene: [Load, Menu, Play, GameOver, Pause],
    backgroundColor: "#FFFFFF",
    scale: {
        // mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

let textConfig;

let game = new Phaser.Game(config);

let { width, height } = game.config;
let carWidth = 960;

let gameWon = false;


//sources thus far:

/*
title font: https://www.dafont.com/weekly-planner.font 
subtitle font: https://www.dafont.com/hooey.font
sidebar text font: https://www.dafont.com/f25-bank-printer.font?text=sample+text&back=theme 
track 1 ("super spiffy"): https://www.fesliyanstudios.com/royalty-free-music/download/super-spiffy/356 
track 2 ("prairie evening"): https://www.fesliyanstudios.com/royalty-free-music/download/prairie-evening/3028 
car start sfx: https://pixabay.com/sound-effects/043210-carstartskidcrashwav-77417/ 
car ambiance: https://pixabay.com/sound-effects/parking-lot-ambience-73908/ 
eating sfx: https://pixabay.com/sound-effects/eating-sound-effect-36186/ 
drinking sfx: https://pixabay.com/sound-effects/heavy-swallowwav-14682/ 
open glovebox sfx: https://pixabay.com/sound-effects/open-toolbox-103809/ 
close glovebox sfx: https://pixabay.com/sound-effects/lid-close-98389/ 
click switch sfx: https://pixabay.com/sound-effects/click-button-140881/ 
*/