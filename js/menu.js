'use strict';
let Menu = (function() {
    let graphics = Graphics;

    let buttonX = [192, 110, 149, 160];
    let buttonY = [100, 140, 180, 220];

	let mouseX;
	let mouseY;
	let buttonWidth = [96, 260, 182, 160];
	let buttonHeight = [40, 40, 40, 40];

    let backgroundImage = {
        image: new Image(),
        x: 0,
        y: 0,
        width: graphics.width,
        height: graphics.height
    };

    let playImage = {
        image: new Image(),
        x: buttonX[0],
        y: buttonY[0],
        width: buttonWidth[0],
        height: buttonHeight[0]
    };

    let instructionsImage = {
        image: new Image(),
        x: buttonX[1],
        y: buttonY[1],
        width: buttonWidth[1],
        height: buttonHeight[1]
    };

    let settingsImage = {
        image: new Image(),
        x: buttonX[2],
        y: buttonY[2],
        width: buttonWidth[2],
        height: buttonHeight[2]
    };

    let creditsImage = {
        image: new Image(),
        x: buttonX[3],
        y: buttonY[3],
        width: buttonWidth[3],
        height: buttonHeight[3]
    };

    let leftShipImage = {
        image: new Image(),
        x: 10,
        y: 10,  
        width: 35,
        height: 40
    }

    let rightShipImage = {
        image: new Image(),
        x: 10,
        y: 10,
        width: 35,
        height: 40
    }
    
    backgroundImage.image.src = "images/background.png";
    playImage.image.src = "images/play.png";
    instructionsImage.image.src = "images/instructions.png";
    settingsImage.image.src = "images/settings.png";
    creditsImage.image.src = "images/credits.png";
    leftShipImage.image.src = "images/ship.png";
    rightShipImage.image.src = "images/ship.png";

    let scrollSpeed = 0.5;
    let backgroundY = 0;
    

    let canvas = document.getElementById('canvas');
    willDisplay();
    

    function handleMouseMove(event) {
        if(event.pageX || event.pageY == 0){
			mouseX = event.pageX - this.offsetLeft;
			mouseY = event.pageY - this.offsetTop;
		} else if(event.offsetX || event.offsetY == 0){
			mouseX = event.offsetX;
			mouseY = event.offsetY;
		}

		for(let i = 0; i < buttonX.length; i++){
			if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
				if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
                    leftShipImage.x = buttonX[i] - leftShipImage.width;
					leftShipImage.y = buttonY[i] + 2;
					rightShipImage.x = buttonX[i] + buttonWidth[i];
					rightShipImage.y = buttonY[i] + 2;
				}
			}
		}
    }

    function getSelection() {
        
        if (leftShipImage.y == buttonY[0] + 2) {
            console.log("Clicked play");
            return GameStatus.PLAY;
        }

        if (leftShipImage.y == buttonY[1] + 2) {
            console.log("Clicked Instructions");
            return GameStatus.INSTRUCTIONS;
        }

        if (leftShipImage.y == buttonY[2] + 2) {
            console.log("Clicked Settings");
            return GameStatus.SETTINGS;
        }

        if (leftShipImage.y == buttonY[3] + 2) {
            console.log("Cliked Credits");
            return GameStatus.CREDITS;
        }
    }

    function willDisplay() {
        canvas.addEventListener('mousemove', handleMouseMove)
    }

    function removeMouseMoveEvent() {
        canvas.removeEventListener('mousemove', handleMouseMove);
    }

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
        graphics.drawImage(leftShipImage);
        graphics.drawImage(rightShipImage);
    }

    function drawBackground() {
        graphics.drawImage(backgroundImage);
    }

    return {
        update: update,
        render: render,
        drawBackground: drawBackground,
        removeMouseMoveEvent: removeMouseMoveEvent,
        willDisplay: willDisplay,
        getSelection: getSelection,
    }

}());