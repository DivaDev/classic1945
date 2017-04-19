
let fs = require('fs');
let express = require('express');
let app = express();
// let server = app.listen(3000, handleRequest);
let http = require('http').createServer(app);


let data = fs.readFileSync('./db/scores.json'); // Want to use sync version
let scores = JSON.parse(data);

// app.use(express.static('./'));
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.use('/', express.static(__dirname + '/'));

http.listen(3000);

// // http://localhost:3000/scores/all
app.get('/scores/all', (request, response) => {
    response.send(scores);
});

app.post('/scores/add/:user/:score/:date', (request, response) => {
    const params = request.params;
    const user = params.user;
    const score = Number(params.score);
    const date = params.date;
    
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
});

console.log('server is listening on port 3000...');