'use strict';
/*
Images taken from:
    > https://code.tutsplus.com/tutorials/animating-game-menus-and-screen-transitions-in-html5-a-guide-for-flash-developers--active-11183
*/
const GameStatus = {
    MENU: 0,
    PLAY: 1,
    INSTRUCTIONS: 2,
    HIGH_SCORES: 3,
    SETTINGS: 4,
    CREDITS: 5,
    PAUSE: 6,
    GAME_OVER: 7
};

let GameEngine = (function() {
    let status = GameStatus.MENU;

    let lastRender = 0;
    let graphics = Graphics;
    let menu = Menu;
    let game = new Game(graphics);
    let timerInterval = 0;
    let newGameAnimation = AnimateGameLoading(graphics);
    
    SoundSystem.play('audio/Star_Wars_Theme_John_Williams');

    let canvas = document.getElementById('canvas');
    canvas.addEventListener('click', function() {

        if (game.gameOver) {
            game.reset();
            status = GameStatus.MENU;
            SoundSystem.play('audio/Star_Wars_Theme_John_Williams');
            menu.willDisplay();
            return;
        }

        if (status === GameStatus.PAUSE) {
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
            menu.removeMouseMoveEvent();
            newGameAnimation = AnimateGameLoading(graphics);
            newGameAnimation.create(menu.leftShipImage, menu.rightShipImage);
            game.initialize(Settings.inputDispatch);
        } else if (selection === GameStatus.SETTINGS) {
            Settings.initialize();
        } else if (selection === GameStatus.HIGH_SCORES) {
            HighScores.initialize();
        }

        status = selection;
    });

    document.addEventListener('keyup', (event) => {
        if (event.keyCode === 27) { // esc
            if (status === GameStatus.PLAY && !game.gameOver) {
                status = GameStatus.PAUSE;
            } else {
                status = GameStatus.MENU;
                SoundSystem.play('audio/Star_Wars_Theme_John_Williams');
                Settings.willDisappear();
                menu.willDisplay();
                game.reset();
            }
        }
    });

    function showPause() {
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

    let fps = 0;
    let lastRun;
    let delta;

    function gameloop(timestamp) {

        delta = (new Date().getTime() - lastRun) / 1000;
        lastRun = new Date().getTime();

        let progress = timestamp - lastRender;

        update(progress);
        render();

        lastRender = timestamp;
        requestAnimationFrame(gameloop);
    }

    function update(elapsedTime) {
        if(game.gameOver){
            return;
        }

        if(status === GameStatus.PAUSE){
            return;
        }

        menu.update(elapsedTime, status);
        newGameAnimation.update(elapsedTime);
        if (status === GameStatus.PLAY && newGameAnimation.finished) {
            game.update(elapsedTime);
        } else if (status === GameStatus.SETTINGS) {
            Settings.update(elapsedTime);
        } else if (status === GameStatus.CREDITS) {
            Credits.update(elapsedTime);
        } else if (status === GameStatus.INSTRUCTIONS) {
            Instructions.update(elapsedTime);
        } else if (status === GameStatus.HIGH_SCORES) {
            HighScores.update(elapsedTime);        
        }

        if (timerInterval > 1000) {
            timerInterval = 0;
            fps = 1 / delta; // this could be placed anywhere it will still work
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
        } else if (status === GameStatus.PLAY && newGameAnimation.finished || status === GameStatus.PAUSE) {
            // render the game after new game animation has ended
            game.render();
        } else if (status === GameStatus.SETTINGS) {
            Settings.render();
        } else if (status === GameStatus.CREDITS) {
            Credits.render();
        } else if (status === GameStatus.INSTRUCTIONS) {
            Instructions.render();
        } else if (status === GameStatus.HIGH_SCORES) {
            HighScores.render();
        }

        if (status === GameStatus.PAUSE) {
            // At bottom so the text appears on top of everything else
            showPause();   
        }

        // Show Frames Per Second
        graphics.drawText({
            font: "12px Arial",
            color: "#FFFFFF",
            text: 'FPS: ' + fps.toFixed(0).toString(),
            x: graphics.width - 47,
            y: graphics.height - 5
        })

    }

    requestAnimationFrame(gameloop);
    
}());
