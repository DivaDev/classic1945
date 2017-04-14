function Player(startX, startY) {
    const hitPoints = 100;
    let self = {};
    let movementSpeed = 4;

    self.image = new Image();
    self.width = 35;
    self.height = 40;
    self.center = { x: startX - self.width / 2, y: startY - self.height / 2 };
    self.x = self.center.x;
    self.y = self.center.y;

    self.image.src = "Images/rsz_xwing.png";
    self.willMoveUp = false;
    self.willMoveLeft = false;
    self.willMoveDown = false;
    self.willMoveRight = false;
    self.missiles = [];
    self.health = {
        hitPoints: hitPoints,
        outline: {
            x: 5,
            y: 15,
            width: 100,
            height: 10,
            strokeStyle: 'rgba(0, 225, 0, 0.5)',
            lineWidth: 1
        },
        fill: {
            x: 5,
            y: 15,
            width: hitPoints,
            height: 10,
            fillStyle: 'rgba(0, 225, 0, 0.5)',
        },

        update: function() {
            if (self.health.hitPoints >= 0) {
                self.health.fill.width = self.health.hitPoints;
            }
        },

        text: {
            font: "8px Arial",
            color: "#FFFFFF",
            text: 'Health',
            x: 5,
            y: 10
        }
    };


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
