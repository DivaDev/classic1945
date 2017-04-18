/*
    To install packages
    > npm install

    To start server.
    > node server.js

*/

var scores = [{
    user: 'Billy',
    score: 123,
    date: 'today'
}, {
    user: 'Sally',
    score: 321,
    date: 'yesterday'
}];

let express = require('express');
let app = express();
let server = app.listen(3000, handleRequest);

function handleRequest() {
    console.log('server is listening on port 3000...');
}

app.use(express.static('./'));

// http://localhost:3000/highscores/abc/5
app.get('/highscores/:something/:num', (request, response) => {
    let data = request.params;
    const n = data.num;
    let reply = "";
    for (let i = 0; i < n; i++) {
        reply += 'i love ' + data.something + ' too yay<br/>';
    }

    response.send(reply);
});

// http://localhost:3000/scores/fran/10/today
app.get('/scores/:user/:score/:date', (request, response) => {
    const params = request.params;
    const user = params.user;
    const score = Number(params.score);
    const date = params.date;
    scores.push({
        'user': user,
        'score': score,
        'date': date
    });

    const reply = "Thank you";

    response.send(reply);
})

// http://localhost:3000/scores/all
app.get('/scores/all', (request, response) => {
    response.send(scores);
});