let config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 640,
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            // debug: true
        }
    },
    scene: [Load, Menu, Play, GameOver],
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


//sources thus far:

/*
title font: https://www.dafont.com/weekly-planner.font 
subtitle font: https://www.dafont.com/hooey.font
sidebar text font: https://www.dafont.com/f25-bank-printer.font?text=sample+text&back=theme 
track 1 ("super spiffy"): https://www.fesliyanstudios.com/royalty-free-music/download/super-spiffy/356 
track 2 ("prairie evening"): https://www.fesliyanstudios.com/royalty-free-music/download/prairie-evening/3028 
car start sfx: https://pixabay.com/sound-effects/043210-carstartskidcrashwav-77417/ 
car ambiance: https://pixabay.com/sound-effects/parking-lot-ambience-73908/ 
*/