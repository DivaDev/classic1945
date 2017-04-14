let Credits = (function() {

    /*

    Sites that may be worth mentioning in credits but may not fit in the screen
    https://code.tutsplus.com/tutorials/animating-game-menus-and-screen-transitions-in-html5-a-guide-for-flash-developers--active-11183

    Background image: http://i.imgur.com/hnAwzLU.jpg

     */

    function initialize() {
        
    }

    function update(elapsedTime) {

    }

    const lines = [{
        font: "16px Arial",
        color: "#FFFFFF",
        text: 'Created By',
        x: Graphics.width / 2 - 40,
        y: 75
    }, {
        font: "16px Arial",
        color: "#FFFFFF",
        text: 'Laurel Stewart',
        x: Graphics.width / 2 - 55,
        y: 100
    }, {
        font: "16px Arial",
        color: "#FFFFFF",
        text: 'Francisco Arrieta',
        x: Graphics.width / 2 - 60,
        y: 125
    }];

    function render() {
        lines.forEach((line) => {
            Graphics.drawText(line);
        });
    }

    return {
        initialize: initialize,
        update,
        render,
    }

}());