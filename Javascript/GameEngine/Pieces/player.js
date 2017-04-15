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
                    color: 'rgba(119, 157, 223, 0.5)',
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
                self.superWeapon.updateChargePercent(superWeaponTimer);
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
    let timerInterval = 0;
    let state = 0;

    let chargeLevel = 0; // range between 0 and 1
    let particleTimer = 0;    

    let particles = ParticleSystem({
        center: { x: 300, y: 300 },
        speed: { mean: 30, stdev: 15 },
        lifetime: { mean: 1, stdev: 0.25 }
    }, Graphics);

    let nParticles = 0;
    self.ready = false;
    function charge(elapsedTime, player) {
        
        if (timerInterval < 2500) {
            radiusDelta = 0.1;
            nParticles = 2;
            self.ready = false;
        } else if (timerInterval < 6000) {
            radiusDelta = 0.5;
            nParticles = 4;
            self.ready = true;
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
        chargeLevel = timerInterval / 6000;
        chargeLevel = Math.min(chargeLevel, 1);
        chargePercent = chargeLevel;
    }

    self.updateChargePercent = function(elapsedTime) {
        let time = elapsedTime / 1500;
        chargePercent = chargeLevel * time;
        chargePercent = chargeLevel - chargePercent;
    };

    self.update = function(elapsedTime, player, weaponState) {
        state = weaponState;
        self.isFiring = false;

        if (state === 0) {
            // do nothing
            return;
        }

        self.x = player.x + player.width / 2;
        self.y = player.y + 10;

        if (state === 1) {
            // charge
            charge(elapsedTime, player);
            particles.update(elapsedTime);
            return;
        }

        // Fire weapon
        self.fire();
    };

    let chargePercent = 0;
    let explosionRadiusDelta = 3;
    self.isFiring = false;

    self.fire = function() {
        // send a pulse wave in all directions by increasing the radius
        self.radius += explosionRadiusDelta * chargeLevel;
        self.isFiring = true;
        particles.reset();
    };
    
    self.render = function() {
        // draw the charge status
        Graphics.drawUnFilledRectangle({
            lineWidth: 1,
            strokeStyle: 'green',
            x: 5,
            y: Graphics.height - 100 - 20, // minus height - padding
            width: 15,
            height: 100,
        });

        Graphics.drawText({
            font: '12px sans-serif',
            text: "CHARGE",
            x: 17, // 12px + 5( the width of the charge box) = 17
            y: Graphics.height - 50,
            color: 'red',
            rotation: {
                angle: -Math.PI * .5,
                width: 10,
                height: 10
            },
        });

        Graphics.drawRectangle({
            x: 5,
            y: Graphics.height - 20,
            width: 15,
            height: -chargePercent * 100,
            fillStyle: 'rgba(0, 225, 0, 0.5)',
        });

        if (state === 0) {
            return;
        }

        if (state === 1) {
            particles.render();
            return;
        }

        if (self.ready) {
            Graphics.drawCircle(self);
        }
    };

    return self;
}
