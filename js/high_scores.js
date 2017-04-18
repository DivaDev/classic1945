let HighScores = (function() {

    const widthOfTable = Graphics.width - 60;
    const heightOfTable = Graphics.height - 60;
    
    const table = {
        lineWidth: 1,
        strokeStyle: 'red',
        x: 30,
        y: 30,
        width: widthOfTable,
        height: heightOfTable
    }
    
    function update(elapsedTime) {
    }

    function render() {

        // Draw the table
        Graphics.drawUnFilledRectangle(table);
        Graphics.drawUnFilledRectangle({
            lineWidth: 1,
            strokeStyle: 'red',
            x: 30,
            y: 30,
            width: widthOfTable / 3,
            height: heightOfTable / 5
        });

        Graphics.drawUnFilledRectangle({
            lineWidth: 1,
            strokeStyle: 'red',
            x: widthOfTable / 3 + 30,
            y: 30,
            width: widthOfTable / 3,
            height: heightOfTable / 5,
        });

        Graphics.drawUnFilledRectangle({
            lineWidth: 1,
            strokeStyle: 'red',
            x: widthOfTable / 3 * 2 + 30,
            y: 30,
            width: widthOfTable / 3,
            height: heightOfTable / 5,
        });


    }

    return {
        update: update,
        render: render
    }

}());
