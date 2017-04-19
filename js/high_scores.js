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

    // $(document).ready(function() {
    //     $.getJSON('./db/scores.json', function(data) {
    //         scores = data.all;
    //         console.log(scores);
    //     });

    //     // $.post("./db/scores.json", function(data, status){
    //     //     alert("Data: " + data + "\nStatus: " + status);
    //     // });

    //     // $.post('./db/scores.json', {"something": 123});

    //     // submitHighscore();
    // })

    // post("http://localhost:3000/db/scores.json"
    function add(name, score, date) {
        // $.post("/scores/add/" + name + "/" + score + "/" + date, { name: "John", time: "2pm" })
        //     .done(function( data ) {
        //         console.log("success");
        // });

        $.post("/scores/add/" + name + "/" + score + "/" + date).done(function(data){
            console.log('Scored saved!');
        });
        fetchScoresFromServer();
    }

    function fetchScoresFromServer() {
        $.getJSON('./db/scores.json', function(data) {
            scores = data.all;
            console.log(scores);
        });
    }

    return {
        update: update,
        render: render
    }

}());
