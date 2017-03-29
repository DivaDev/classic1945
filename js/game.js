function Game(grahpics) {
    self = {};

    self.player = null;

    self.startNew = function() {
        console.log('start game');
        self.player = {
            x: 10,
            y: 10, 
            width: 10,
            height: 10,
            color: "#AABBCC",
        }
    }

    self.update = function() {

    }

    self.render = function() {
        grahpics.drawSquare(self.player);
    }

    return self;
}
