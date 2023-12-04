let config = {
    type: Phaser.WEBGL,
    width: 960,
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
    scene: [Load, Menu, Play],
    backgroundColor: "#dabbed",
    scale: {
        // mode: Phaser.Scale.FIT,
    }
}

let textConfig;

let game = new Phaser.Game(config);

let { width, height } = game.config;


//sources thus far:

/*
title font: https://www.dafont.com/weekly-planner.font 
subtitle font: https://www.dafont.com/hooey.font
*/