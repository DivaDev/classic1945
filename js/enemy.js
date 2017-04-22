function Enemy(path, fireAtPercentages) {
    let percent = 0;
    let hasFired = false;    
    let self = {};
    self.image = new Image();
    self.image.src = "Images/rsz_tie_fighter.png";
    self.speed = 1;
    self.path = path;
    self.finished = false;
    self.x = self.path.startX;
    self.y = self.path.startY;
    self.width = 35; // image width
    self.height = 30; // image height
    self.willFire = false;
    let rateOfFire = fireAtPercentages; // Array ex [.75, .5, .25]

    self.fire = function(target) {
        // Target must have a x, y, width, and height
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
            endX: target.x + target.width / 2,
            endY: target.y + target.height / 2
        });

        if (target.hasOwnProperty('deflect')) {
            // missile that boss is going to deflect
            missile.deflect = true;
        }
        
        self.willFire = false;
        return missile;
    };


    self.update = function(player, elapsedTime) {
        move();

        let percentComplete = percent / 300;

        if (rateOfFire.length !== 0 && percentComplete > rateOfFire[rateOfFire.length - 1]) {
            rateOfFire.pop();
            self.willFire = true;
        }
    };

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


function Vader(path, fireAtPercentages) {

    // Figure 8 path
    const paths = path.paths;
    const descendSpeed = 3
    const hitPoints = 1000;
    
    let rateOfFire = fireAtPercentages.slice();
    let isAppearing = true;
    let currentPathIndex = 1; // Start on the top right hump of the path
    let appearanceTimer = 1500;
    let assistanceRequestInterval = [0.25, 0.50, 0.75];
    let percent = 0;
    
    // controls when it is allowed to get hit by the ott weapon.
    let ottInterval = 0; 

    let self = Enemy(path, fireAtPercentages);
    self.boss = true; // attribute to identify aa boss from enemy
    self.width = 35;
    self.height = 37;
    self.image.src = "Images/rsz_vader_tie_fighter2.png";
    self.image.width = 47;
    self.image.height = 37;
    
    self.x = Graphics.width / 2 - self.width / 2 + 2;
    self.y = 0;
    self.willFire = false;


    self.path = paths[currentPathIndex];
    self.requestAssistance = false;
    
    self.canGetHitByOTT = true;

    function updateIfCanGetHitByOTT(elapsedTime) {

        if (self.canGetHitByOTT) {
            return;
        }

        if (ottInterval > 1500) {
            // Allows the over the top(ott) weapon to only hit once instead of multiple times
            // when the ott weapon is expanding
            self.canGetHitByOTT = true;
            ottInterval = 0;
        }
        ottInterval += elapsedTime;
    }

    // Vader has health
    self.health = {
        hitPoints: hitPoints,
        outline: {
            x: self.x,
            y: self.y,
            width: self.width,
            height: 3,
            strokeStyle: 'rgba(0, 225, 0, 0.5)',
            lineWidth: 1
        },
        fill: {
            x: self.x,
            y: self.y,
            width: self.width / 1000,
            height: 3,
            fillStyle: 'rgba(0, 225, 0, 0.5)',
        },

        update: function() {

            self.health.outline.x = self.x + 5;
            self.health.outline.y = self.y;
            self.health.fill.x = self.x + 5;
            self.health.fill.y = self.y;
                        
            if (self.health.hitPoints >= 0) {
                self.health.fill.width = self.health.hitPoints / hitPoints * self.width;
            }

            handleRequestingBackup();
        }
    };


    function handleRequestingBackup() {
        // Allow vader to send some enemy tie fighters
        // send back up at 25, 50, and 75 percent of health
        const health = self.health.hitPoints / hitPoints;
        if (health < assistanceRequestInterval[assistanceRequestInterval.length - 1]) {
            assistanceRequestInterval.pop();
            self.requestAssistance = true;
        }
    }

    self.update = function(player, elapsedTime) {

        updateIfCanGetHitByOTT(elapsedTime);
        
        // animate down
        if (isAppearing) {
            if (self.y + self.height / 2 < paths[1].startY) {
                self.y += ((elapsedTime / 100) * descendSpeed);
            } else {
                isAppearing = false;
            }
        } else {
            handleDeflecting(player);
            move();
            // have player follow paths
            let percentComplete = percent / 300;
            if (rateOfFire.length !== 0 && percentComplete > rateOfFire[rateOfFire.length - 1]) {
                rateOfFire.pop();
                self.willFire = true;
            }
        }

        self.health.update();
    }

    self.missilesThatAreClose = [];

    function handleDeflecting(player) {

        if (player.missiles.length === 0) { // no missiles
            return;
        }

        // let missilesThatAreClose = [];
        self.missilesThatAreClose.length = 0;
        // check if any missiles are in range
        // calculate if a missile is in path to hit vader
        for (let i = 0; i < player.missiles.length; i++) {
            if (
                Math.abs(player.missiles[i].y - self.y) < 50 && // vertical distance
                player.missiles[i].x > paths[0].startX && // left side of figure 8 path
                player.missiles[i].x < paths[1].endX && // right side of figure 8 path
                !player.missiles[i].hasOwnProperty('tag') // tag if not tagged to avoid firing at same missile twice
            ) {
                self.missilesThatAreClose.push(player.missiles[i]);
                player.missiles[i].tag = true;
            }
        }

        if (self.missilesThatAreClose.length === 0) {
            return; // no missiles are close
        }

        // Dodge only when on path
        // Instead of dodging, we'll do a deflect because its easier
        // file at income missile
        for (let i = 0; i < self.missilesThatAreClose.length; i++) {
            randomNumber = Math.random();
            if (randomNumber > 0.5) {// 50% chance of deflecting
                self.missilesThatAreClose[i].deflect = true;
            }
        }
        self.willFire = true;
        // When not on path than i'm moving.
        // If moving then animate move away then back onto path
    }

    function move() {

        percent += 3;
        let percentComplete = percent / 300;
        let coord = FollowPathSystem.update(self.path, percentComplete);

        self.x = coord.x - self.width / 2;
        self.y = coord.y - self.height / 2;


        if (percent >= 300) {
            
            percent = 0;
            updateCurrentPath();
            
            // http://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript
            rateOfFire = fireAtPercentages.slice(); // copy by value
        }
    }

    function updateCurrentPath() {
        currentPathIndex++;
        if (currentPathIndex >= paths.length) {
            currentPathIndex = 0;
        }
        self.path = paths[currentPathIndex];
    }

    self.render = function() {
        Graphics.drawImage(self);
        Graphics.drawUnFilledRectangle(self.health.outline);
        Graphics.drawRectangle(self.health.fill);
    }

    SoundSystem.play('audio/Imperial_song_John_Williams');
    
    // Vader fires multiple times and may have more than one weapon
    return self;
}
