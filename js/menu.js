'use strict';
let Menu = (function() {
    let graphics = Graphics;

    let buttonX = [graphics.width / 2 - 25, graphics.width / 2 - 60, graphics.width / 2 - 65, graphics.width / 2 - 45, graphics.width / 2 - 40];
    // let buttonY = [100, 140, 180, 220];
    let buttonY = [graphics.height / 5 + 40, graphics.height / 5 + 80, graphics.height / 5 + 120, graphics.height / 5 + 160, graphics.height / 5 + 200];

	let mouseX;
	let mouseY;
	let buttonWidth = [53, 128, 137, 93, 83];
	let buttonHeight = [40, 40, 40, 40, 40];

    let backgroundImage = {
        image: new Image(),
        x: 0,
        y: 0,
        width: graphics.width,
        height: graphics.height
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
    
    backgroundImage.image.src = "Images/background.png";
    leftShipImage.image.src = "Images/rsz_xwing.png";
    rightShipImage.image.src = "Images/rsz_xwing.png";

    let scrollSpeed = 0.5;
    let backgroundY = -1 * graphics.height;

    let canvas = document.getElementById('canvas');

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
                    leftShipImage.x = buttonX[i] - leftShipImage.width - 5;
					leftShipImage.y = buttonY[i] - 10;
					rightShipImage.x = buttonX[i] + buttonWidth[i];
					rightShipImage.y = buttonY[i] - 10;
				}
			}
		}
    }

    function getSelection() {
        
        if (leftShipImage.y === buttonY[0] - 10) {
            console.log("Clicked play");
            return GameStatus.PLAY;
        }

        if (leftShipImage.y === buttonY[1] - 10) {
            console.log("Clicked Instructions");
            return GameStatus.INSTRUCTIONS;
        }

        if (leftShipImage.y === buttonY[2] - 10) {
            console.log("Clicked High Scores");
            return GameStatus.HIGH_SCORES;
        }

        if (leftShipImage.y === buttonY[3] - 10) {
            console.log("Clicked Settings");
            return GameStatus.SETTINGS;
        }

        if (leftShipImage.y === buttonY[4] - 10) {
            console.log("Clicked Credits");
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
        backgroundY += scrollSpeed;

        if (backgroundY > 0) {
            backgroundY = -1 * graphics.height;
        }

        backgroundImage.y = backgroundY;
    }

    function render() {
        graphics.drawText({
            font: "24px Arial",
            color: "#92959b",
            text: "Play",
            x: buttonX[0],
            y: buttonY[0] + 25,
        });

        graphics.drawText({
            font: "24px Arial",
            color: "#92959b",
            text: "Instructions",
            x: buttonX[1],
            y: buttonY[1] + 25,
        });

        graphics.drawText({
            font: "24px Arial",
            color: "#92959b",
            text: "High Scores",
            x: buttonX[2],
            y: buttonY[2] +25,
        });

        graphics.drawText({
            font: "24px Arial",
            color: "#92959b",
            text: "Settings",
            x: buttonX[3],
            y: buttonY[3] + 25,
        });

        graphics.drawText({
            font: "24px Arial",
            color: "#92959b",
            text: "Credits",
            x: buttonX[4],
            y: buttonY[4] + 25,
        });

        graphics.drawImage(leftShipImage);
        graphics.drawImage(rightShipImage);
    }

    function drawBackground() {
        graphics.drawImage(backgroundImage);
    }

    willDisplay();

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

        // graphics.drawLine(self.leftShipPath);
        // graphics.drawLine(self.rightShipPath);

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