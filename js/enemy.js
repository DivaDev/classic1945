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
            endX: player.x + player.width / 2,
            endY: player.y + player.height / 2
        });
        
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
    let self = Enemy(path, fireAtPercentages);
    self.boss = true; // attribute to identify aa boss from enemy
    self.image.src = "Images/rsz_vader_tie_fighter2.png";
    self.width = 35;
    self.height = 37;
    self.x = Graphics.width / 2 - self.width / 2 + 2;
    self.y = 0;
    self.willFire = false;
    let rateOfFire = fireAtPercentages.slice();
    let isAppearing = true;
    const paths = path.paths;
    const descendSpeed = 3
    let currentPathIndex = 1; // Start on the top right hump of the path
    let appearanceTimer = 1500;
    let percent = 0;

    self.path = paths[currentPathIndex];
    self.requestAssistance = false;
    
    self.canGetHitByOTT = true;
    let ottInterval = 0;

    function updateIfCanGetHitByOTT(elapsedTime) {

        if (self.canGetHitByOTT) {
            return;
        }

        if (ottInterval > 1500) {
            self.canGetHitByOTT = true;
            ottInterval = 0;
        }
        ottInterval += elapsedTime;
    }

    const hitPoints = 1000;
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

    let assistanceRequestInterval = [0.25, 0.50, 0.75];

    function handleRequestingBackup() {

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

        // context.beginPath();
        // context.lineWidth = spec.lineWidth;
        // context.strokeStyle = spec.strokeStyle;
        // context.rect(spec.x, spec.y, spec.width, spec.height);
        // context.stroke();
        Graphics.drawUnFilledRectangle(self.health.outline);
        Graphics.drawRectangle(self.health.fill);
        // Graphics.drawRectangle(self.health.fill);
        
    }

    SoundSystem.play('audio/Imperial_song_John_Williams');
    
    // Give vader the figure 8 path
    // Vader fires multiple times and may have more than one weapon
    // Vader also has health
    // Maybe allow vader to send some enemy tie fighters

    return self;
}