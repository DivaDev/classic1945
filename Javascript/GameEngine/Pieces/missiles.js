function Missile(specs) {
    let self = {};
    self.x = specs.x;
    self.y = specs.y;
    self.width = specs.width;
    self.height = specs.height;
    self.color = specs.color;
    self.speed = 4;

    self.update = function () {
    };

    return self;
}

function PlayerMissile(specs) {
    let self = Missile(specs); // 'inherit' from Missile
    self.path = {
        type: PathTypes.LINE,
        startX: self.x,
        startY: self.y,
        endX: self.x,
        endY: 0
    };

    self.update = function () {
        self.y -= self.speed;
    };

    return self;
}

function EnemyMissile(specs, path) {
    let self = Missile(specs);
    self.path = path;
    let percent = 0;

    self.update = function () {
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
