function Enemy(path) {
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

    self.update = function(player) {
        move();

        let percentComplete = percent / 300;

        if (!hasFired && percentComplete > .5) {
            self.willFire = true;
            hasFired = true;
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
