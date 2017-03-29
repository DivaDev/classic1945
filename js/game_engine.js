'use strict';
/*
Images taken from:
    > https://code.tutsplus.com/tutorials/animating-game-menus-and-screen-transitions-in-html5-a-guide-for-flash-developers--active-11183
*/
let GameEngine = (function() {

    const GameStatus = {
        MENU: 0,
        PLAY: 1,
        INSTRUCTIONS: 2,
        SETTINGS: 3,
        CREDITS: 4
    };

    let status = GameStatus.MENU;

    let lastRender = 0;
    let graphics = Graphics;
    let menu = Menu;
    let game = new Game(graphics);

    let timerInterval = 0;

    let canvas = document.getElementById('canvas');
    canvas.addEventListener('click', function() {
        status = GameStatus.PLAY;
        game.startNew();
    });


    // canvas.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', () => {
        if (event.keyCode === 27) { // esc
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

    let scrollSpeed = 0.5;

    function update(elapsedTime) {
        menu.update();

        if (timerInterval > 1000) {
            timerInterval = 0;
        } else {
            timerInterval += elapsedTime;
        }
    }

    function render() {
        graphics.beginDrawing();
        menu.drawBackground();

        if (status == GameStatus.MENU) {
            menu.render();
        } else if (status == GameStatus.PLAY) {
            game.render();
        }

    }

    requestAnimationFrame(gameloop);
    
}());