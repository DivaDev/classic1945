let fs = require('fs');
let data = fs.readFileSync('./db/scores.json');
let scores = JSON.parse(data);

exports.all = function(request, response) {
    console.log(scores.all);
    response.send(scores.all);
}

exports.add = function(request, response) {
    const params = request.params;
    const user = params.user;
    const score = Number(params.score);
    const date = params.date;

    console.log('Saving score...');
    
    scores.all.push({
        "user": user,
        "score": score,
        "date": date
    });

    const data = JSON.stringify(scores, null, 4);  // Do not resign to scores

    fs.writeFile('./db/scores.json', data, (error) => {
        const reply = {
            status: "success",
            'user': user,
            "score": score,
            "date": date
        };

        response.send(reply);
    });
}
