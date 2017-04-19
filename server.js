
let express = require('express');
let app = express();
let fs = require('fs');
let http = require('http');
let path = require('path');
let scores = require('./routes/scores'); // scores.js

app.set('port', process.env.PORT || 3000);

app.use('/', express.static(__dirname + '/'));
app.get('/', (request, response) => {
    response.render('index.html');
});

app.use(express.static(path.join(__dirname, 'routes')));

http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server is listening on port ' + app.get('port'));
});

// Find the all and add functions in scores.js
app.get('/v1/scores/all', scores.all);
app.post('/v1/scores/add/:user/:score/:date', scores.add);

// Indicate any other api request are not implemented
app.all('/v1/*', (request, response) => {
    response.writeHead(501);
    response.end();
});
