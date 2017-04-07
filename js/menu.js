'use strict';
let Menu = (function() {
    let graphics = Graphics;

    let buttonX = [192, 110, 149, 160];
    // let buttonY = [100, 140, 180, 220];
    let buttonY = [graphics.height / 4 + 40, graphics.height / 4 + 80, graphics.height / 4 + 120, graphics.height / 4 + 160]

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
    };

    let rightShipImage = {
        image: new Image(),
        x: 10,
        y: 10,
        width: 35,
        height: 40
    };
    
    backgroundImage.image.src = "images/background.png";
    playImage.image.src = "images/play.png";
    instructionsImage.image.src = "images/instructions.png";
    settingsImage.image.src = "images/settings.png";
    creditsImage.image.src = "images/credits.png";
    leftShipImage.image.src = "images/rsz_xwing.png";
    rightShipImage.image.src = "images/rsz_xwing.png";

    let scrollSpeed = 0.5;
    let backgroundY = 0;

    let canvas = document.getElementById('canvas');
    willDisplay();

    function  getMousePos(event) {
        // http://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
        let rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

        return {
            x: (event.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (event.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }
    
    function handleMouseMove(event) {
        let coord = getMousePos(event);
        mouseX = coord.x;
        mouseY = coord.y;

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
        leftShipImage: leftShipImage,
        rightShipImage: rightShipImage
    }
}());

function AnimateGameLoading(graphics) {
    let self = {};
    
    self.finished = true;
    self.leftShipPath = null;
    self.rightShipPath = null;
    let percent = 0;
    let direction = 1;

    self.create = function (leftShip, rightShip) {
        self.leftShip = leftShip;
        self.rightShip = rightShip;
        self.finished = false;
        console.log('created');
        console.log(self.finished);
        self.leftShipPath = {
            startX: self.leftShip.x,
            startY: self.leftShip.y,
            endX: graphics.width / 2,
            endY: graphics.height - 20
        };

        self.rightShipPath = {
            startX: self.rightShip.x,
            startY: self.rightShip.y,
            endX: graphics.width / 2,
            endY: graphics.height - 20
        };
    };

    self.update = function(elapsedTime) {

        if (self.finished) {
            return;
        }

        percent += direction;

        let percentageComplete = percent / 100;
        let leftShipXY = getLineXYAtPercent({
            x: self.leftShipPath.startX,
            y: self.leftShipPath.startY
        }, {
            x: self.leftShipPath.endX,
            y: self.leftShipPath.endY
        }, percentageComplete);

        let rightShipXY = getLineXYAtPercent({
            x: self.rightShipPath.startX,
            y: self.rightShipPath.startY
        }, {
            x: self.rightShipPath.endX,
            y: self.rightShipPath.endY
        }, percentageComplete);

        self.leftShip.x = leftShipXY.x - self.leftShip.width / 2;
        self.leftShip.y = leftShipXY.y - self.leftShip.height / 2;

        self.rightShip.x = rightShipXY.x - self.rightShip.width / 2;
        self.rightShip.y = rightShipXY.y - self.rightShip.height / 2;

        if (percent >= 100) {
            self.finished = true;
        }
    };

    self.render = function() {
        if (self.finished) {
            return;
        }

        graphics.drawLine(self.leftShipPath);
        graphics.drawLine(self.rightShipPath);

        graphics.drawImage(self.leftShip);
        graphics.drawImage(self.rightShip);
    };

    function getLineXYAtPercent(startPt, endPt, percent) {
        let dx = endPt.x - startPt.x;
        let dy = endPt.y - startPt.y;
        let X = startPt.x + dx * percent;
        let Y = startPt.y + dy * percent;
        return ({
            x: X,
            y: Y
        });
    }

    return self;
}