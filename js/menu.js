'use strict';
let Menu = (function() {
    let graphics = Graphics;
    let backgroundImage = {
        image: new Image(),
        x: 0,
        y: 0,
        width: graphics.width,
        height: graphics.height
    };

    let playImage = {
        image: new Image(),
        x: 192,
        y: 100,
        width: 92,
        height: 40
    };

    let instructionsImage = {
        image: new Image(),
        x: 110,
        y: 140,
        width: 260,
        height: 40
    };

    let settingsImage = {
        image: new Image(),
        x: 149,
        y: 180,
        width: 182,
        height: 40
    };

    let creditsImage = {
        image: new Image(),
        x: 160,
        y: 220,
        width: 160,
        height: 40
    };
    
    backgroundImage.image.src = "images/background.png";
    playImage.image.src = "images/play.png";
    instructionsImage.image.src = "images/instructions.png";
    settingsImage.image.src = "images/settings.png";
    creditsImage.image.src = "images/credits.png";

    let scrollSpeed = 0.5;
    let backgroundY = 0;

    function update() {
        backgroundY -= scrollSpeed;

        if(backgroundY == -1 * graphics.height){
            backgroundY = 0;
        }
        backgroundImage.y = backgroundY;
    }

    function render() {
        graphics.drawImage(playImage);
        graphics.drawImage(instructionsImage);
        graphics.drawImage(settingsImage);
        graphics.drawImage(creditsImage);
    }

    function drawBackground() {
        graphics.drawImage(backgroundImage);
    }

    return {
        update: update,
        render: render,
        drawBackground: drawBackground,
    }

}());