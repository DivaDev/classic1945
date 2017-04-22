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
    let gameOverInterval = 0;
    let possiblePaths = FollowPathSystem.possiblePaths;
    let enemyMissiles = [];
    let ceaseFire = false;
    let willAddHighScore = true;
    let willChargeSuperBeam = false;    

    self.player = null;
    self.inputDispatch = null;
    self.gameOver = false;
    let onBossLevel = false;

    self.initialize = function (controls) {
        console.log('start game');
        self.player = new Player(graphics.width / 2, graphics.height - 20);
        self.inputDispatch = controls;
        willAddHighScore = true;

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    };

    let nextLevelUpAt = 1;
    function getEnemyFireRate() {
        // Creates a fire rate interval that is dependent on the score.
        // Ex. if nextLevelUpAt = 3 then it will produce [0.25, 0.50, 0.75].
        const currentScore = CollisionSystem.getEnemiesHit();
        if (currentScore > nextLevelUpAt * 10) { // Increase level every 10 points
            nextLevelUpAt++;
        }

        const interval = 1 / (nextLevelUpAt + 1);
        let rate = [];
        for (let i = 1; i <= nextLevelUpAt; i++) {
            rate.unshift(interval * i); // place at beginning of array
        }

        return rate;
    }

    self.reset = function () {
        self.gameOver = false;
        enemies.length = 0;
        enemyMissiles.length = 0;
        self.player = null;
        willChargeSuperBeam = false;
        willAddHighScore = true;
        timerInterval = 0;
        localInterval = 0;
        ceaseFire = false;
        gameOverInterval = 0;
        countLaunchedEnemies = 0;
        AnimationSystem.reset();
        CollisionSystem.reset();
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

        if (event.keyCode === 32 && !ceaseFire) { // space
            self.player.fire();
            self.player.fireSuperWeapon();
            willChargeSuperBeam = false;
            SoundSystem.play('audio/XWing-Laser.wav');
        }
    }

    function updateEnemies(elapsedTime) {
        enemies.forEach(function (enemy) {
            enemy.update(self.player, elapsedTime);
            if (enemy.willFire && !ceaseFire) {
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

        if (nextLevelUpAt === 3) {
            onBossLevel = true;
        }

        if (onBossLevel) {
            // wait till all enemies have gone off the screen
            if (enemies.length === 0) {
                // load vader
                enemies.push(new Vader(possiblePaths[possiblePaths.length - 1], [0.5]));
            } else {
                if (enemies[0].requestAssistance === true) {
                    handleDeployingEnemies();
                    enemies[0].requestAssistance = false;
                }
            }

        } else if (sendEnemies) {
            handleDeployingEnemies();            
        }
    }

    function handleDeployingEnemies() {
        if (localInterval > 350) {
            localInterval = 0;
            countLaunchedEnemies++;
            enemies.push(new Enemy(possiblePaths[chosenPath], getEnemyFireRate()));
            if (chosenPath === 7) {
                enemies.push(new Enemy(possiblePaths[8], getEnemyFireRate()));
            }
        }

        if (countLaunchedEnemies > 3) {
            sendEnemies = false;
            countLaunchedEnemies = 0;
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

    function handleClosingTheGame(elapsedTime) {
        ceaseFire = true;

        if(gameOverInterval > 4000){
            gameOverInterval = 0;
            self.gameOver = true;
            saveScore(CollisionSystem.getEnemiesHit());
            willAddHighScore = false;
        }
        gameOverInterval+= elapsedTime;
    }

    self.update = function (elapsedTime) {

        if (CollisionSystem.isBossDefeated()) {
            handleClosingTheGame(elapsedTime);
        }

        // Check for game over
        updatePlayer(elapsedTime);
        CollisionSystem.didPlayerMissilesHitEnemy(enemies, self.player.missiles);
        CollisionSystem.didEnemyMissilesHitPlayer(enemyMissiles, self.player);
        CollisionSystem.checkPlayerSuperWeaponWithEnemies(enemies, self.player);
        updateEnemies(elapsedTime);
        AnimationSystem.update(elapsedTime);
        ImageParticleSystem.update(elapsedTime);

        if(self.player.lives <= 0){ // check for a game over
            handleClosingTheGame();
        }

        if (timerInterval > 2500 && !ceaseFire) {
            timerInterval = 0;
            sendEnemies = true;
            
            chosenPath = getRandomArbitrary(0, possiblePaths.length);
            if (chosenPath === 9) {
                chosenPath--;
            }

            SoundSystem.play('audio/TIE-Fly2.wav');
        } else {
            timerInterval += elapsedTime;
            localInterval += elapsedTime;
        }        
    };

    function getRandomArbitrary(min, max) {
        // The returned value is no lower than (and may possibly equal) min, 
        // and is less than (but not equal to) max.
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function saveScore(score) {
        if (willAddHighScore) {
            let name = prompt("You deserve a plaque! What is your name?")
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth() + 1;  //January is 0!
            let yyyy = today.getFullYear();

            if(dd < 10) {
                dd = '0' + dd
            } 

            if(mm < 10) {
                mm = '0' + mm
            } 

            today = mm + '.' + dd + '.' + yyyy;
            HighScores.add(name, score, today);
        }
    }

    self.render = function () {
        if(self.gameOver){
            graphics.drawText({
                font: "36px Arial",
                color: "#FF0000",
                text: 'GAME OVER!',
                x: graphics.width / 2 - 110,
                y: graphics.height / 2
            });

            graphics.drawText({
                font: "24px Arial",
                color: "#FFFFFF",
                text: 'Final score: ' + CollisionSystem.getEnemiesHit().toString(),
                x: graphics.width / 2 - 70,
                y: graphics.height / 2 + 40
            });

            return;
        }

        graphics.drawUnFilledRectangle(self.player.health.outline);
        graphics.drawRectangle(self.player.health.fill);
        graphics.drawText(self.player.health.text);

        self.player.render();

        graphics.drawText({
            font: "8px Arial",
            color: "#FFFFFF",
            text: 'Score: ' + CollisionSystem.getEnemiesHit().toString(),
            x: graphics.width - 40,
            y: 10
        });

        AnimationSystem.render();
        ImageParticleSystem.render();
        
        if(self.player.lives > 0) {
            graphics.drawImage(self.player);
        }
        self.player.missiles.forEach(function (missile) {
            graphics.drawSquare(missile);
        });

        enemies.forEach(function (enemy) {
            if (enemy.hasOwnProperty('render')) {
                enemy.render();
            } else {
                graphics.drawImage(enemy);
            }
        });

        enemyMissiles.forEach((missile) => {
            graphics.drawSquare(missile);
            // graphics.drawLine(missile.path);
        });

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
        possiblePaths[9].paths.forEach((path) => {
            graphics.drawQuadraticCurve(path);
        })
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

    function reset() {
        animationList.length = 0;
    }

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
        reset: reset
    }

}());





