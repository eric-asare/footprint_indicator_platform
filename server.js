const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

// create database
const Datastore = require("nedb");
const database = new Datastore("database.db");
database.loadDatabase();


app.get('/api', (request, response) => {
    // database find
    database.find({}, function (err, output) {
        if (err) {
            console.log(err);
        }
        response.json(output);
    });
});

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();

    data.timestamp = timestamp;

    database.insert(data);
    response.json(data);
});

// Catch-all route for serving the HTML file
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
