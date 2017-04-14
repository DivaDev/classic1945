'use strict';
/*
Images taken from:
    > https://code.tutsplus.com/tutorials/animating-game-menus-and-screen-transitions-in-html5-a-guide-for-flash-developers--active-11183
*/
const GameStatus = {
    MENU: 0,
    PLAY: 1,
    INSTRUCTIONS: 2,
    SETTINGS: 3,
    CREDITS: 4,
    PAUSE: 5
};

let GameEngine = (function() {
    let status = GameStatus.MENU;

    let lastRender = 0;
    let graphics = Graphics;
    let menu = Menu;
    let game = new Game(graphics);
    let timerInterval = 0;
    let newGameAnimation = AnimateGameLoading(graphics);

    let canvas = document.getElementById('canvas');
    canvas.addEventListener('click', function() {

        if(status === GameStatus.PAUSE){
            status = GameStatus.PLAY;
            return;
        }
        if (status === GameStatus.PLAY) {
            return; // ignore clicks when game is playing
        }

        if (status !== GameStatus.MENU) {
            return;
        }

        const selection = menu.getSelection();

        if (selection === GameStatus.PLAY) {
            status = GameStatus.PLAY;
            menu.removeMouseMoveEvent();
            newGameAnimation = AnimateGameLoading(graphics);
            newGameAnimation.create(menu.leftShipImage, menu.rightShipImage);
            
            game.initialize(Settings.inputDispatch);
        } else if (selection === GameStatus.SETTINGS) {
            status = GameStatus.SETTINGS;
            Settings.initialize();
        } else if (selection === GameStatus.CREDITS) {
            status = GameStatus.CREDITS;
            Credits.initialize();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.keyCode === 27) { // esc
            if (status === GameStatus.PLAY) {
                status = GameStatus.PAUSE;
            } else {
                status = GameStatus.MENU;
                Settings.willDisappear();
                menu.willDisplay();
            }
        }
    });

    function gameloop(timestamp) {
        let progress = timestamp - lastRender;

        update(progress);
        render();

        lastRender = timestamp;
        requestAnimationFrame(gameloop);
    }

    function update(elapsedTime) {

        if(status === GameStatus.PAUSE){
            return;
        }

        menu.update();
        newGameAnimation.update(elapsedTime);
        if (status === GameStatus.PLAY && newGameAnimation.finished) {
            game.update(elapsedTime);
        } else if (status === GameStatus.SETTINGS) {
            Settings.update(elapsedTime);
        } else if (status === GameStatus.CREDITS) {
            Credits.update(elapsedTime);
        }

        if (timerInterval > 1000) {
            timerInterval = 0;
        } else {
            timerInterval += elapsedTime;
        }
    }

    function render() {
        graphics.beginDrawing();
        menu.drawBackground();
        newGameAnimation.render();

        if (status === GameStatus.PAUSE) {
            graphics.drawText({
                font: "36px Arial",
                color: "#FFFFFF",
                text: 'PAUSED',
                x: graphics.width / 2 - 60,
                y: graphics.height / 2
            });

            graphics.drawText({
                font: "12px Arial",
                color: "#FFFFFF",
                text: 'Click anywhere to resume',
                x: graphics.width / 2 - 57,
                y: graphics.height / 2 + 20
            });
        }

        if (status === GameStatus.MENU) {
            menu.render();
        } else if (status === GameStatus.PLAY && newGameAnimation.finished || status === GameStatus.PAUSE) {
            // render the game after new game animation has ended
            game.render();
        } else if (status === GameStatus.SETTINGS) {
            Settings.render();
        } else if (status === GameStatus.CREDITS) {
            Credits.render();
        }

    }

    requestAnimationFrame(gameloop);
    
}());