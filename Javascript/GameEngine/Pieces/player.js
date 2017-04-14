function Player(startX, startY) {
    const hitPoints = 100;
    let self = {};
    let movementSpeed = 4;
    let willFireOnRight = true;    

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

    self.willChargeSuperBeam = false;

    function coolDownWeapons() {
        self.superWeapon = new PlayerSuperWeapon({
        x: self.x + self.width / 2,
        y: self.y + 10,
        radius: self.width / 2,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        fillStyle: '#5394ee',
        strokeStyle: '#d6e2fb',
        lineWidth: 1,
        innerRadius: 5,
        outerRadius: self.width / 2,
        gradient: {
            colors: [{
                offset: 0,
                color: 'white',
            }, {
                offset: 0.5,
                color: 'lightblue',
            }, {
                offset: 1,
                color: '#1e71e3'
            }]
        }
    });
    }

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

    let superWeaponTimer = 0;

    self.update = function(elapsedTime) {
        self.move();

        let missiles = self.missiles;
        for (let i = 0; i < missiles.length; i++) {
            missiles[i].update();

            if (missiles[i].y < 0) {
                // Remove missile when off the screen
                self.missiles.splice(i, 1);
            }
        }
        
        self.superWeapon.update(elapsedTime, self, superWeaponState);

        if (superWeaponState === superWeaponStages.FIRE) {

            if (superWeaponTimer < 1500) {
                superWeaponTimer += elapsedTime;
            } else {
                // After one second turn off the super weapon
                superWeaponState = superWeaponStages.NONE;
                superWeaponTimer = 0;
                coolDownWeapons();
            }
        }
    };

    const superWeaponStages = {
        'NONE': 0,
        'CHARGE': 1,
        'FIRE': 2
    };

    let superWeaponState = superWeaponStages.NONE;

    self.chargeSuperWeapon = function() { superWeaponState = superWeaponStages.CHARGE; };
    self.fireSuperWeapon = function() { superWeaponState = superWeaponStages.FIRE; };

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

    coolDownWeapons();
    return self;
}

let radiusDelta = 0.1;

function PlayerSuperWeapon(specs) {
    // specs should have: x, y, radius, startAngle, endAngle, color
    let self = specs;
    self.willFire = false;
    let chargePercent = 0;
    let timerInterval = 0;
    let state = 0;

    let chargeLevel = 0; // range between 0 and 1
    let particleTimer = 0;    

    let particles = ParticleSystem({
        center: {x: 300, y: 300},
        speed: {mean: 30, stdev: 15},
        lifetime: {mean: 1, stdev: 0.25}
    }, Graphics);

    // let pulseOutward = true;
    // function pulse(elapsedTime) {
    //     if (timerInterval < 1000) {
    //         radiusDelta = 0.1;
    //     } else if (timerInterval < 3000) {
    //         radiusDelta = 0.5;
    //     } else {
    //         radiusDelta = 1;
    //     }

    //     timerInterval += elapsedTime;

    //     if (pulseOutward) {
    //         self.radius += radiusDelta;
    //         chargePercent += 5;
    //     } else {
    //         self.radius -= radiusDelta;
    //         chargePercent -= 5;
    //     }

    //     chargeLevel = (chargeLevel > 1) ? 1 : (chargeLevel += 1 / 100);

    //     if (chargePercent > 100) {
    //         pulseOutward = false;
    //     } 
    //     if (chargePercent < 0) {
    //         pulseOutward = true;
    //     }
    // }

    let nParticles = 0;
    self.weaponReady = false;
    function charge(elapsedTime, player) {
        
        if (timerInterval < 2000) {
            radiusDelta = 0.1;
            nParticles = 2;
        } else if (timerInterval < 5000) {
            radiusDelta = 0.5;
            nParticles = 4;
            self.weaponReady = true;
        } else {
            radiusDelta = 1;
            nParticles = 10;
        }
        
        if (particleTimer > 400) {
            particles.createMultipleParticles(player.x + player.width / 2, player.y + player.height / 2, nParticles);
            particleTimer = 0;
        } else {
            particleTimer += elapsedTime;
        }

        timerInterval += elapsedTime;
        chargeLevel = (chargeLevel > 1) ? 1 : (chargeLevel += 1 / 100);
    }


    self.update = function(elapsedTime, player, weaponState) {
        state = weaponState;

        if (state === 0) {
            // do nothing
            return;
        }

        self.x = player.x + player.width / 2;
        self.y = player.y + 10;

        if (state === 1) {
            // charge
            // pulse(elapsedTime);
            charge(elapsedTime, player);
            particles.update(elapsedTime);
            return;
        }

        // Fire weapon
        self.fire();
    };
    
    let explosionRadiusDelta = 3;

    self.fire = function() {
        // send a pulse wave in all directions by increasing the radius
        self.radius += explosionRadiusDelta * chargeLevel;
        particles.reset();
    };
    
    self.render = function() {
        if (state === 0) {
            return;
        }

        if (state === 1) {
            particles.render();
            return;
        }

        if (self.weaponReady) {
            Graphics.drawCircle(self);
        }
    };

    return self;
}
