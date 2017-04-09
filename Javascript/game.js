'use strict';

const PathTypes = {
    BEZIER: 0,
    LINE: 1,
    QUAD: 2,
};

function Game(graphics) {
    let self = {};
    let enemies = [];
    let sendEnemies = false;
    let chosenPath = 0;
    let countLaunchedEnemies = 0;
    let timerInterval = 0;
    let localInterval = 0;
    let possiblePaths = [];

    const aroundTheMapBezier = {
        type: PathTypes.BEZIER,
        startX: 0,
        startY: 0,
        cp1x: graphics.width / 2,
        cp1y: 200,
        cp2x: graphics.width / 2,
        cp2y: 200,
        endX: graphics.width,
        endY: 0
    };

    const aroundTheMapQuad = {
        type: PathTypes.QUAD,
        startX: 0,
        startY: 0,
        cpx: graphics.width / 2,
        cpy: 200,
        endX: graphics.width,
        endY: 0
    };

    const leftCurveOut = {
        type: PathTypes.QUAD,
        startX: 0,
        startY: 0,
        cpx: graphics.width / 2,
        cpy: graphics.height / 2,
        endX: 0,
        endY: graphics.height
    };

    const rightCurveOut = {
        type: PathTypes.QUAD,
        startX: graphics.width,
        startY: 0,
        cpx: graphics.width / 2,
        cpy: graphics.height / 2,
        endX: graphics.width,
        endY: graphics.height
    };

    const leftToBottomMiddle = {
        type: PathTypes.QUAD,
        startX: 0,
        startY: 0,
        cpx: graphics.width / 2 - 25,
        cpy: graphics.height / 2 - 25,
        endX: graphics.width / 2 - 25,
        endY: graphics.height
    };

    const rightToBottomMiddle = {
        type: PathTypes.QUAD,
        startX: graphics.width,
        startY: 0,
        cpx: graphics.width / 2 + 25,
        cpy: graphics.height / 2 + 25,
        endX: graphics.width / 2 + 25,
        endY: graphics.height
    };

    const leftToBottomMiddleOffset = {
        type: PathTypes.QUAD,
        startX: 0,
        startY: 50,
        cpx: graphics.width / 2 - 50,
        cpy: graphics.height / 2 - 50,
        endX: graphics.width / 2 - 50,
        endY: graphics.height
    };

    possiblePaths.push(aroundTheMapBezier);
    possiblePaths.push(aroundTheMapQuad);
    possiblePaths.push(leftCurveOut);
    possiblePaths.push(rightCurveOut);
    possiblePaths.push(leftToBottomMiddle);
    possiblePaths.push(rightToBottomMiddle);
    possiblePaths.push(leftToBottomMiddleOffset);

    self.player = null;

    self.initialize = function () {
        console.log('start game');
        self.player = new Player(graphics.width / 2, graphics.height - 20);

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    };

    function handleKeyDown(event) {
        if (event.keyCode === 39) {
            self.player.willMoveRight = true;
        } else if (event.keyCode === 37) {
            self.player.willMoveLeft = true;
        }

        if (event.keyCode === 40) {
            self.player.willMoveDown = true;
        } else if (event.keyCode === 38) {
            self.player.willMoveUp = true;
        }
    }

    function handleKeyUp(event) {
        if (event.keyCode === 39) {
            self.player.willMoveRight = false;
        } else if (event.keyCode === 37) {
            self.player.willMoveLeft = false;
        }

        if (event.keyCode === 40) {
            self.player.willMoveDown = false;
        } else if (event.keyCode === 38) {
            self.player.willMoveUp = false;
        }

        if (event.keyCode === 32) { // space
            self.player.fire();
            SoundSystem.play('audio/XWing-Laser.wav');
        }
    }

    self.update = function (elapsedTime) {
        self.player.update();

        CollisionSystem.didMissilesHitEnemy(enemies, self.player.missiles);

        enemies.forEach(function (enemy) {
            enemy.update(self.player);
        });

        enemies = enemies.filter(function (enemy) {
            return !enemy.finished;  // Keep the non finished
        });

        if (timerInterval > 3000) {
            timerInterval = 0;
            sendEnemies = true;
            chosenPath = Math.floor((Math.random() * possiblePaths.length));
            SoundSystem.play('audio/TIE-Fly2.wav');
        } else {
            timerInterval += elapsedTime;
            localInterval += elapsedTime;
        }

        if (sendEnemies) {

            if (localInterval > 350) {
                localInterval = 0;
                countLaunchedEnemies++;
                enemies.push(new Enemy(possiblePaths[chosenPath]));
            }

            if (countLaunchedEnemies > 3) {
                sendEnemies = false;
                countLaunchedEnemies = 0;
            }
        }
    };

    self.render = function () {
        graphics.drawImage(self.player);
        self.player.missiles.forEach(function (missile) {
            graphics.drawSquare(missile);
        });

        enemies.forEach(function (enemy) {
            graphics.drawImage(enemy);
            enemy.missiles.forEach(function (missile) {
                graphics.drawSquare(missile);
                graphics.drawLine(missile.path);
            });

        });

        // Play with
        graphics.drawBezierCurve(possiblePaths[0]);
        graphics.drawQuadraticCurve(possiblePaths[1]);
        graphics.drawQuadraticCurve(possiblePaths[2]);
        graphics.drawQuadraticCurve(possiblePaths[3]);
        graphics.drawQuadraticCurve(possiblePaths[4]);
        graphics.drawQuadraticCurve(possiblePaths[5]);
        graphics.drawQuadraticCurve(possiblePaths[6]);
    };

    return self;
}

let AnimationSystem = (function() {

    function tieFighterExplosion(tieFighter) {
        console.log('render explosion');
    }

    return {
        tieFighterExplosion: tieFighterExplosion
    }

}());





