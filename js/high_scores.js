let HighScores = (function() {

    const widthOfTable = Graphics.width - 60;
    const heightOfTable = Graphics.height - 60;
    let scores = [];
    
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
        Graphics.drawUnFilledRectangle(table);

        for (let i = 0; i < scores.length; i++) {

            // user
            Graphics.drawUnFilledRectangle({
                lineWidth: 1,
                strokeStyle: 'red',
                x: 30,
                y: 30 + height * i,
                width: width,
                height: height
            });

            Graphics.drawText({
                font: "16px Arial",
                color: "#FFFFFF",
                text: scores[i].user,
                x: 40,
                y: 75 + i * 48
            });

            // score
            Graphics.drawUnFilledRectangle({
                lineWidth: 1,
                strokeStyle: 'red',
                x: width + 30,
                y: 30 + height * i,
                width: width,
                height: height
            });

            Graphics.drawText({
                font: "16px Arial",
                color: "#FFFFFF",
                text: scores[i].score,
                x: width + 30 + 10,
                y: 75 + i * 48
            });

            // date
            Graphics.drawUnFilledRectangle({
                lineWidth: 1,
                strokeStyle: 'red',
                x: width * 2 + 30,
                y: 30 + height * i,
                width: width,
                height: height
            });

            Graphics.drawText({
                font: "16px Arial",
                color: "#FFFFFF",
                text: scores[i].date,
                x: width * 2 + 30 + 10,
                y: 75 + i * 48
            });
        }
    }

    const width = widthOfTable / 3;
    const height = heightOfTable / 5;
    // post("http://localhost:3000/db/scores.json"
    function add(name, score, date) {
        // /v1/scores/add/:user/:score/:date
        $.post("/v1/scores/add/" + name + "/" + score + "/" + date).done(function(data){
            console.log('Scored saved!');
        });
    }

    function fetchScoresFromServer() {
        $.get('v1/scores/all').done(function(data) {
            scores = data;

            // Sort ascending order
            scores.sort(function(a, b) {
                return a.score < b.score;
            });

            // Only show the top 5 scores
            scores.length = Math.min(5, scores.length);
        });
    }

    function initialize() {
        fetchScoresFromServer();
        
    }

    return {
        update: update,
        render: render,
        add: add,
        initialize: initialize
    }

}());
