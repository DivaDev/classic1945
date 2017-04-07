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
    let countLaunchedEnemies  = 0;
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

    self.initialize = function() {
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
            SoundSystem.play('audio/XWing-Laser');
        }
    }

    self.update = function(elapsedTime) {
        self.player.update();

        CollisionSystem.didMissilesHitEnemy(enemies, self.player.missiles);

        enemies.forEach(function(enemy) {
            enemy.update(self.player);
        });

        enemies = enemies.filter(function(enemy) {
            return !enemy.finished;  // Keep the non finished
        });

        if (timerInterval > 3000) {
            timerInterval = 0;
            sendEnemies = true;
            chosenPath = Math.floor((Math.random() * possiblePaths.length));
        } else {
            timerInterval += elapsedTime;
            localInterval += elapsedTime;
        }

        if(sendEnemies){

            if(localInterval > 350){
                localInterval = 0;
                countLaunchedEnemies++;
                enemies.push(new Enemy(possiblePaths[chosenPath]));
            }

            if(countLaunchedEnemies > 3){
                sendEnemies = false;
                countLaunchedEnemies = 0;
            }
        }
    };

    self.render = function() {
        graphics.drawImage(self.player);
        self.player.missiles.forEach(function(missile) {
            graphics.drawSquare(missile);
        });

        enemies.forEach(function(enemy) {
            graphics.drawImage(enemy);
            enemy.missiles.forEach(function(missile) {
                graphics.drawSquare(missile);
            })
        });

        // Play with
        // graphics.drawBezierCurve(possiblePaths[0]);
        // graphics.drawQuadraticCurve(possiblePaths[1]);
        // graphics.drawQuadraticCurve(possiblePaths[2]);
        // graphics.drawQuadraticCurve(possiblePaths[3]);
        // graphics.drawQuadraticCurve(possiblePaths[4]);
        // graphics.drawQuadraticCurve(possiblePaths[5]);
        // graphics.drawQuadraticCurve(possiblePaths[6]);
    };

    return self;
}

function Player(startX, startY) {
    let self = {};
    let movementSpeed = 4;

    self.image = new Image();
    self.width = 35;
    self.height = 40;
    self.center = { x: startX - self.width / 2, y: startY - self.height / 2 };
    self.x = self.center.x;
    self.y = self.center.y;
    
    self.image.src = "images/rsz_xwing.png";
    self.willMoveUp = false;
    self.willMoveLeft = false;
    self.willMoveDown = false;
    self.willMoveRight = false;
    self.missiles = [];
    let willFireOnRight = true;

    self.fire = function() {
        let missile = new PlayerMissile({
            x: self.x + 2,
            y: self.y,
            width: 3,
            height: 15,
            color: "#990000",
        });

        if (willFireOnRight) {
            missile.x += self.width - 6;
        }

        willFireOnRight = !willFireOnRight;
        self.missiles.push(missile);
    };

    self.update = function() {
        self.move();

        let missiles = self.missiles;
        for (let i = 0; i < missiles.length; i++) {
            missiles[i].update();

            if (missiles[i].y < 0) {
                // Remove missile when off the screen
                self.missiles.splice(i, 1);
            }
        }
    };

    self.move = function() {
        if (self.willMoveUp) {
            self.y -= movementSpeed;
        }

        if (self.willMoveDown) {
            self.y += movementSpeed;
        }

        if (self.willMoveLeft) {
            self.x -= movementSpeed;
        }

        if (self.willMoveRight) {
            self.x += movementSpeed;
        }
    };

    return self;
}

function Missile(specs) {
    let self = {};
    self.x = specs.x;
    self.y = specs.y;
    self.width = specs.width;
    self.height = specs.height;
    self.color = specs.color;
    self.speed = 4;

    self.update = function() {};

    return self;
}

function PlayerMissile(specs) {
    let self = Missile(specs); // 'inherit' from Missile

    self.update = function() {
        self.y -= self.speed;
    };

    return self;
}

function EnemyMissile(specs, path) {
    let self = Missile(specs);
    self.path = path;
    let percent = 0;

    self.update = function() {
        // self.y -= self.speed;

        percent += 1;

        let percentageComplete = percent / 100;
        let coord = FollowPathSystem.update(self.path, percentageComplete);
        self.x = coord.x;
        self.y = coord.y;

        if (percent >= 100) {
            self.finished = true;
        }
    };

    return self;
}

function Enemy(path) {
    let percent = 0;
    let self = {};
    self.image = new Image();
    self.image.src = "images/rsz_tie_fighter.png";
    self.speed = 1;
    self.path = path;
    self.finished = false;
    self.x = self.path.startX;
    self.y = self.path.startY;
    self.width = 35; // image width
    self.height = 30; // image height
    self.missiles = [];

    self.fire = function(player) {
        let missile = new EnemyMissile({
            x: self.x + 2,
            y: self.y,
            width: 3,
            height: 15,
            color: "#009900",
        }, {
            type: PathTypes.LINE,
            startX: self.x,
            startY: self.y,
            endX: player.x,
            endY: player.y
        });

        self.missiles.push(missile);
    };

    self.update = function(player) {
        move();

        let percentComplete = percent / 300;

        if (!hasFired && percentComplete > .5) {
            self.fire(player);
            hasFired = true;
        }

        let missiles = self.missiles;
        for (let i = 0; i < missiles.length; i++) {
            missiles[i].update();

            if (missiles[i].y < 0) {
                // Remove missile when off the screen
                self.missiles.splice(i, 1);
            }
        }
    };

    let hasFired = false;

    function move() {
        percent += 1;

        let percentComplete = percent / 300;
        let coord = FollowPathSystem.update(self.path, percentComplete);

        self.x = coord.x;
        self.y = coord.y;

        if (percent >= 300) {
            self.finished = true;
        }
    }

    return self;
}

let FollowPathSystem = (function() {
    function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
        let x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
        let y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
        return ({
            x: x,
            y: y
        });
    }

    function getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
        let x = CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
        let y = CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
        return ({
            x: x,
            y: y
        });
    }

    function CubicN(pct, a, b, c, d) {
        let t2 = pct * pct;
        let t3 = t2 * pct;
        return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
    }

    function update(path, percentComplete) {
        if (path.type === PathTypes.BEZIER) {
            return getCubicBezierXYatPercent({
                x: path.startX,
                y: path.startY
            }, {
                x: path.cp1x,
                y: path.cp1y
            }, {
                x: path.cp2x,
                y: path.cp2y
            }, {
                x: path.endX,
                y: path.endY
            }, percentComplete);
        }

        if (path.type === PathTypes.QUAD) {
            return getQuadraticBezierXYatPercent({
                x: path.startX,
                y: path.startY
            }, {
                x: path.cpx,
                y: path.cpy
            }, {
                x: path.endX,
                y: path.endY
            }, percentComplete);
        }

        if (path.type === PathTypes.LINE) {
            return getLineXYAtPercent({
                x: path.startX,
                y: path.startY
            }, {
                x: path.endX,
                y: path.endY
            }, percentComplete);
        }
    }

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

    return {
        update: update
    }

}());

let CollisionSystem = (function() {

    function didMissilesHitEnemy(enemies, missiles) {

        if (enemies.length === 0 || missiles.length === 0) {
            return;
        }

        let tempEnemies = enemies;
        for (let i = 0; i < tempEnemies.length; i++) {

            let tempMissiles = missiles;

            for (let j = 0; j < tempMissiles.length; j++) {
                if (willCollide(enemies[i], missiles[j])) {
                    enemies.splice(i, 1);
                    missiles.splice(j, 1);
                    break;
                }
            }
        }
    }

    function willCollide(enemy, missile) {
        if (enemy.x <= (missile.x + missile.width) && missile.x <= (enemy.x + enemy.width) && enemy.y <= (missile.y + missile.height) && missile.y <= (enemy.y + enemy.height - 10)){
            return true;
        }
        return false;
    }

    return {
        didMissilesHitEnemy: didMissilesHitEnemy
    };

}());

let SoundSystem = (function() {
    let sounds = {};

    function loadSound(source) {
        let sound = new Audio();
        sound.src = source;
        return sound;
    }

    function loadAudio() {
        sounds['audio/XWing-Laser'] = loadSound('audio/XWing-Laser.wav');
        console.log('Sound Initialized');
    }

    function play(sound) {
        // sounds[sound].play();
        let audio = loadSound('audio/XWing-Laser.wav');
        audio.play();
    }

    // loadAudio();

    return {
        play: play,
    }
}());