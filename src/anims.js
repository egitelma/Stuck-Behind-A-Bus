//animations in Play scene
function loadAnims(scene){
    scene.anims.create({
        key: "glovebox-open",
        frameRate: 16,
        repeat: 0,
        frames: scene.anims.generateFrameNumbers("glovebox", {
            start: 0,
            end: 3
        })
    })

    scene.anims.create({
        key: "glovebox-close",
        frameRate: 16,
        repeat: 0,
        frames: scene.anims.generateFrameNumbers("glovebox", {
            start: 3,
            end: 0
        })
    })

    scene.anims.create({
        key: "radio-on",
        frameRate: 16,
        repeat: 0,
        frames: scene.anims.generateFrameNumbers("radioSwitch", {
            start: 0,
            end: 7
        })
    })

    scene.anims.create({
        key: "radio-off",
        frameRate: 16,
        repeat: 0,
        frames: scene.anims.generateFrameNumbers("radioSwitch", {
            start: 7,
            end: 0
        })
    })

    scene.anims.create({
        key: "road-move",
        frameRate: 8,
        repeat: -1,
        frames: scene.anims.generateFrameNumbers("road", {
            start: 0,
            end: 5
        })
    })
}