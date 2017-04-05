const PathTypes = {
    BEZIER: 0,
    LINE: 1,
    QUAD: 2,
};

function Game(graphics) {
    let timerInterval = 0;
    let possiblePaths = [];
    let aroundTheMap = {
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

    let stuff = {
        type: PathTypes.QUAD,
        startX: 0,
        startY: 0,
        cpx: graphics.width / 2,
        cpy: 200,
        endX: graphics.width,
        endY: 0
    };

    // let path = {
    //     startPt: {
    //         x: 200,
    //         y: 160
    //     },
    //     controlPt: {
    //         x: 230,
    //         y: 200
    //     },
    //     endPt: {
    //         x: 250,
    //         y: 120
    //     }
    // }

    possiblePaths.push(aroundTheMap);
    possiblePaths.push(stuff);
    let enemies = [];
    
    self = {};
    self.player = null;

    self.initialize = function() {
        console.log('start game');
        self.player = new Player(graphics.width / 2, graphics.height - 20);

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    function handleKeyDown(event) {
        if (event.keyCode === 39) {
            self.player.willMoveRight = true;
        } else if (event.keyCode === 37) {
            self.player.willMoveLeft = true;
        }

        if (event.keyCode == 40) {
            self.player.willMoveDown = true;
        } else if (event.keyCode == 38) {
            self.player.willMoveUp = true;
        }
    }

    function handleKeyUp(event) {
        console.log(event.keyCode);
        if (event.keyCode === 39) {
            self.player.willMoveRight = false;
        } else if (event.keyCode === 37) {
            self.player.willMoveLeft = false;
        }

        if (event.keyCode === 40) {
            self.player.willMoveDown = false;
        } else if (event.keyCode == 38) {
            self.player.willMoveUp = false;
        }

        if (event.keyCode === 32) { // space
            self.player.fire();
        }
    }

    self.update = function(elapsedTime) {
        self.player.update();

        enemies.forEach(function(enemy) {
            enemy.update();
        });

        enemies = enemies.filter(function(enemy) {
            return !enemy.finished;  // Keep the non finished
        });

        console.log(enemies.length);

        if (timerInterval > 1500) {
            timerInterval = 0;
            let randomX = Math.floor((Math.random() * graphics.width) + 5);
            
            enemies.push(new Enemy(randomX, -10, possiblePaths[1]));

        } else {
            timerInterval += elapsedTime;
        }
    }


    self.render = function() {
        graphics.drawImage(self.player);
        self.player.missiles.forEach(function(missile) {
            graphics.drawSquare(missile);
        });

        enemies.forEach(function(enemy) {
            graphics.drawImage(enemy);
        })

        // Play with
        graphics.drawBezierCurve(possiblePaths[0]);
        graphics.drawQuadraticCurve(possiblePaths[1]);
    }

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
        let missile = new Missile({
            x: self.x + 2,
            y: self.y,
            width: 3,
            height: 15,
            color: "#AABBCC",
        });

        if (willFireOnRight) {
            missile.x += self.width - 6;
        }

        willFireOnRight = !willFireOnRight;

        self.missiles.push(missile);
    }

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


    }

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
    }

    self.move

    return self;
}

function Missile(specs) {
    let self = {};
    self.x = specs.x;
    self.y = specs.y;
    self.width = specs.width;
    self.height = specs.height;
    self.color = "#009900";
    self.speed = 4;

    self.update = function() {
        self.y -= self.speed;
    }

    return self;
}

function Enemy(x, y, path) {
    let percent = 0;
    let self = {};

    // self.x = x;
    // self.y = y;
    self.image = new Image();
    self.image.src = "images/rsz_tie_fighter.png";
    self.speed = 1;
    self.path = path;
    self.finished = false;
    self.x = self.path.startX;
    self.y = self.path.startY;

    self.update = function() {

        percent += 1;

        let percentComplete = percent / 300;
        // let bezierCoord = getCubicBezierXYatPercent({
        //     x: self.path.startX,
        //     y: self.path.startY
        // }, {
        //     x: self.path.cp1x,
        //     y: self.path.cp1y
        // }, {
        //     x: self.path.cp2x,
        //     y: self.path.cp2y
        // }, {
        //     x: self.path.endX,
        //     y: self.path.endY
        // }, percentComplete);

        // self.x = bezierCoord.x;
        // self.y = bezierCoord.y;
        let quadCoord = getQuadraticBezierXYatPercent({
            x: self.path.startX,
            y: self.path.startY
        }, {
            x: self.path.cpx,
            y: self.path.cpy
        }, {
            x: self.path.endX,
            y: self.path.endY
        }, percentComplete);

        self.x = quadCoord.x;
        self.y = quadCoord.y;

        if (percent >= 300) {
            self.finished = true;
        }

        self.y += self.speed;
    }

    return self;
}

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
    var t2 = pct * pct;
    var t3 = t2 * pct;
    return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
}