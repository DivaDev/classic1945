function Game(graphics) {
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
        if (event.keyCode === 39) {
            self.player.willMoveRight = false;
        } else if (event.keyCode === 37) {
            self.player.willMoveLeft = false;
        }

        if (event.keyCode == 40) {
            self.player.willMoveDown = false;
        } else if (event.keyCode == 38) {
            self.player.willMoveUp = false;
        }
    }

    self.update = function() {
        self.player.move();
    }

    self.render = function() {
        graphics.drawImage(self.player);        
    }

    return self;
}

function Player(startX, startY) {
    let self = {};
    let movementSpeed = 4;

    self.image = new Image();
    self.width = 35;
    self.height = 40;
    // self.x = startX;
    // self.y = startY;
    self.center = { x: startX - self.width / 2, y: startY - self.height / 2 };
    self.x = self.center.x;
    self.y = self.center.y;
    
    self.image.src = "images/ship.png";
    self.willMoveUp = false;
    self.willMoveLeft = false;
    self.willMoveDown = false;
    self.willMoveRight = false;

    self.move = function() {
        if (self.willMoveUp) self.y -= movementSpeed;
        if (self.willMoveDown) self.y += movementSpeed;
        if (self.willMoveLeft) self.x -= movementSpeed;
        if (self.willMoveRight) self.x += movementSpeed;
    }  

    self.move

    return self;
}