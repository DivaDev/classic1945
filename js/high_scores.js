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

            // score
            Graphics.drawUnFilledRectangle({
                lineWidth: 1,
                strokeStyle: 'red',
                x: width + 30,
                y: 30 + height * i,
                width: width,
                height: height
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

    // function fetchScoresFromServer() {
    //     $.getJSON('./db/scores.json', function(data) {
    //         scores = data.all;
    //         console.log(scores);
    //     });
    // }

    function fetchScoresFromServer() {
        $.get('v1/scores/all').done(function(data) {
            scores = data;
        });
    }
    fetchScoresFromServer();

    return {
        update: update,
        render: render
    }

}());
