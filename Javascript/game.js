'use strict';

const PathTypes = {
    BEZIER: 0,
    LINE: 1,
    QUAD: 2,
};

function Game(graphics) {
    FollowPathSystem.loadPaths();
    
    let self = {};
    let enemies = [];
    let sendEnemies = false;
    let chosenPath = 0;
    let countLaunchedEnemies = 0;
    let timerInterval = 0;
    let localInterval = 0;
    let possiblePaths = FollowPathSystem.possiblePaths;
    let enemyMissiles = [];

    self.player = null;
    self.inputDispatch = null;

    self.initialize = function (controls) {
        console.log('start game');
        self.player = new Player(graphics.width / 2, graphics.height - 20);
        self.inputDispatch = controls;

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    };

    function handleKeyDown(event) {
        if (event.keyCode === self.inputDispatch['RIGHT'].keycode) {
            self.player.willMoveRight = true;
        } else if (event.keyCode === self.inputDispatch['LEFT'].keycode) {
            self.player.willMoveLeft = true;
        }

        if (event.keyCode === self.inputDispatch['DOWN'].keycode) {
            self.player.willMoveDown = true;
        } else if (event.keyCode === self.inputDispatch['UP'].keycode) {
            self.player.willMoveUp = true;
        }

        if (event.keyCode === 32) {
            willChargeSuperBeam = true;
            fireButtonPressed = true;
        }
    }

    let willChargeSuperBeam = false;

    function handleKeyUp(event) {
        if (event.keyCode === self.inputDispatch['RIGHT'].keycode) {
            self.player.willMoveRight = false;
        } else if (event.keyCode === self.inputDispatch['LEFT'].keycode) {
            self.player.willMoveLeft = false;
        }

        if (event.keyCode === self.inputDispatch['DOWN'].keycode) {
            self.player.willMoveDown = false;
        } else if (event.keyCode === self.inputDispatch['UP'].keycode) {
            self.player.willMoveUp = false;
        }

        if (event.keyCode === 32) { // space
            self.player.fire();
            self.player.fireSuperWeapon();
            willChargeSuperBeam = false;
            SoundSystem.play('audio/XWing-Laser.wav');
        }
    }

    function updateEnemies() {
        enemies.forEach(function (enemy) {
            enemy.update(self.player);
            if (enemy.willFire) {
                enemyMissiles.push(enemy.fire(self.player));
            }
        });

        enemies = enemies.filter((enemy) => {
            return !enemy.finished;  // Keep the non finished
        });

        let missiles = enemyMissiles;
        for (let i = 0; i < missiles.length; i++) {
            missiles[i].update();

            if (missiles[i].y < 0) {
                // Remove missile when off the screen
                enemyMissiles.splice(i, 1);
            }
        }
    }

    let fireButtonPressed = false;
    let playerWeaponTimer = 0;

    function updatePlayer(elapsedTime) {

        if (willChargeSuperBeam) {
            playerWeaponTimer += elapsedTime;
        } else {
            playerWeaponTimer = 0;
        }

        if (playerWeaponTimer > 300) {
            self.player.chargeSuperWeapon();
        }

        self.player.update(elapsedTime);


        keepPlayerWithInBounds();
    }

    self.update = function (elapsedTime) {

        updatePlayer(elapsedTime);
        CollisionSystem.didPlayerMissilesHitEnemy(enemies, self.player.missiles);
        CollisionSystem.didEnemyMissilesHitPlayer(enemyMissiles, self.player);
        CollisionSystem.checkPlayerSuperWeaponWithEnemies(enemies, self.player);
        updateEnemies();

        if (timerInterval > 3000) {
            timerInterval = 0;
            sendEnemies = true;
            chosenPath = Math.floor((Math.random() * possiblePaths.length));
            SoundSystem.play('audio/TIE-Fly2.wav');
        } else {
            timerInterval += elapsedTime;
            localInterval += elapsedTime;
        }

        AnimationSystem.update(elapsedTime);

        if (sendEnemies) {

            if (localInterval > 350) {
                localInterval = 0;
                countLaunchedEnemies++;
                enemies.push(new Enemy(possiblePaths[chosenPath]));
                if (chosenPath === 7) {
                    enemies.push(new Enemy(possiblePaths[8]));
                }
            }

            if (countLaunchedEnemies > 3) {
                sendEnemies = false;
                countLaunchedEnemies = 0;
            }
        }
    };

    self.render = function () {
        graphics.drawUnFilledRectangle(self.player.health.outline);
        graphics.drawRectangle(self.player.health.fill);
        graphics.drawText(self.player.health.text);

        self.player.superWeapon.render();

        graphics.drawText({
            font: "8px Arial",
            color: "#FFFFFF",
            text: 'Score: ' + CollisionSystem.getEnemiesHit().toString(),
            x: graphics.width - 40,
            y: 10
        });

        AnimationSystem.render();
        graphics.drawImage(self.player);
        self.player.missiles.forEach(function (missile) {
            graphics.drawSquare(missile);
        });

        enemies.forEach(function (enemy) {
            graphics.drawImage(enemy);
        });

        enemyMissiles.forEach((missile) => {
            graphics.drawSquare(missile);
            // graphics.drawLine(missile.path);
        })

        // Play with
        // graphics.drawBezierCurve(possiblePaths[0]);
        // graphics.drawQuadraticCurve(possiblePaths[1]);
        // graphics.drawQuadraticCurve(possiblePaths[2]);
        // graphics.drawQuadraticCurve(possiblePaths[3]);
        // graphics.drawQuadraticCurve(possiblePaths[4]);
        // graphics.drawQuadraticCurve(possiblePaths[5]);
        // graphics.drawQuadraticCurve(possiblePaths[6]);
        // graphics.drawQuadraticCurve(possiblePaths[7]);
        // graphics.drawQuadraticCurve(possiblePaths[8]);
    };

    function keepPlayerWithInBounds() {
        if (self.player.x < 0) {
            self.player.x = 0;
        }

        if (self.player.x > graphics.width - self.player.width) {
            self.player.x = graphics.width - self.player.width;
        }

        if (self.player.y < 0) {
            self.player.y = 0;
        }

        if (self.player.y > graphics.height - self.player.height) {
            self.player.y = graphics.height - self.player.height;
        }
    }

    return self;
}

let AnimationSystem = (function() {

    let animationList = [];
    let explosionImages = [];
    let playerExplosion = [];

    function addExplosion(fighter, imageSource) {

        let sprite = {
            image: new Image(),
            // 128 is half the size of the enemy image
            x: fighter.x - 128 + fighter.width / 2,
            y: fighter.y - 128 + fighter.height / 2,
            i: 0,
            interval: 0,
        };

        sprite.image.src = imageSource;
        animationList.push(sprite);
    }

    function loadExplosions() {
        for (let i = 0; i < 155; i++) {
            explosionImages.push(new Image());

            if (i < 10) {
                explosionImages[i].src = "images/explosion/explosion000" + i + ".png";
            } else if (i < 100) {
                explosionImages[i].src = "images/explosion/explosion00" + i + ".png";
            } else {
                explosionImages[i].src = "images/explosion/explosion0" + i + ".png";
            }
        }

        for (let i = 0; i < 45; i++) {
            playerExplosion.push(new Image());

            if (i < 10) {
                playerExplosion[i].src = "images/player_hit_explosion/explosion000" + i + ".png";
            } else if (i < 100) {
                playerExplosion[i].src = "images/player_hit_explosion/explosion00" + i + ".png";
            } else {
                playerExplosion[i].src = "images/player_hit_explosion/explosion0" + i + ".png";
            }
        }
    }

    loadExplosions();

    function update(elapsedTime) {
        let tempList = animationList;
        for (let i = 0; i < tempList.length; i++) {

            if (tempList[i].interval < 10) {
                animationList[i].interval += elapsedTime;
                continue;
            }

            animationList[i].interval = 0;
            animationList[i].image = explosionImages[animationList[i].i];

            if (animationList[i].i < 0) {
                animationList.splice(i, 1);
            } else if (animationList[i].i >= 154) {
                animationList[i].i = -1;
            } else {
                animationList[i].i += 1;
            }
        }
    }

    function render() {
        animationList.forEach(function (sprite) {
            Graphics.drawImage(sprite);
        });
    }

    return {
        addExplosion: addExplosion,
        update: update,
        render: render,
    }

}());





