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
    CREDITS: 4
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
        if (status === GameStatus.PLAY) {
            return; // ignore clicks when game is playing
        }

        if (status !== GameStatus.MENU) {
            return;
        }

        if (menu.getSelection() === GameStatus.PLAY) {
            status = GameStatus.PLAY;
            menu.removeMouseMoveEvent();
            newGameAnimation = AnimateGameLoading(graphics);
            newGameAnimation.create(menu.leftShipImage, menu.rightShipImage);
            
            game.initialize();
        } else if (menu.getSelection() === GameStatus.SETTINGS) {
            status = GameStatus.SETTINGS;
            Settings.initialize();
        }
    });


    document.addEventListener('keyup', () => {
        if (event.keyCode === 27) { // esc
            Settings.willDispear();
            menu.willDisplay();
            status = GameStatus.MENU;
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

        menu.update();
        newGameAnimation.update(elapsedTime);
        if (status === GameStatus.PLAY) {
            game.update(elapsedTime);
        } else if (status === GameStatus.SETTINGS) {
            Settings.update(elapsedTime);
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
        
        if (status === GameStatus.MENU) {
            menu.render();
        } else if (status === GameStatus.PLAY && newGameAnimation.finished) {
            // render the game after new game animation has ended
            game.render();
        } else if (status === GameStatus.SETTINGS) {
            Settings.render();
        }

    }

    requestAnimationFrame(gameloop);
    
}());