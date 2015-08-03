require('colors');
var sqlite3 = require('sqlite3').verbose();
db = new sqlite3.Database('database.db');

Client = require('rockets');

var express = require('express');
app = express();

var rockets = require('./lib/Rockets.js')
rockets.run();

app.locals.helpers = require('./lib/helpers.js');
app.use(express.static('public'));
app.set('view engine', 'jade');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    db.serialize(function() {
        db.all("SELECT id, text, subr, user, url, type, date FROM models ORDER BY date DESC LIMIT 50", function(err, models) {
            db.all("SELECT keyword FROM contains", function(err, keywords) {
                db.all("SELECT subreddit FROM subreddits", function(err, subreddits) {
                    res.render('index', { models: models, keywords: keywords, subreddits: subreddits, req: req });
                });
            });
        });
    });
});

app.post('/keyword', function (req, res) {
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO contains(keyword) VALUES(?)");
        stmt.run(req.body.keyword);
        stmt.finalize();
    });
    rockets.reconnect();
    res.redirect(303, '/');
});

app.post('/subreddit', function (req, res) {
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO subreddits(subreddit) VALUES(?)");
        stmt.run(req.body.subreddit);
        stmt.finalize();
    });
    rockets.reconnect();
    res.redirect(303, '/');
});

app.post('/delete/keyword', function (req, res) {
    db.serialize(function() {
        var stmt = db.prepare("DELETE FROM contains WHERE keyword = ?");
        stmt.run(req.body.keyword);
        stmt.finalize();
    });
    rockets.reconnect();
    res.redirect(303, '/');
});

app.post('/delete/subreddit', function (req, res) {
    db.serialize(function() {
        var stmt = db.prepare("DELETE FROM subreddits WHERE subreddit = ?");
        stmt.run(req.body.subreddit);
        stmt.finalize();
    });
    rockets.reconnect();
    res.redirect(303, '/');
});

app.get('/entries', function (req, res) {
    db.serialize(function() {
        var models = []
        db.each("SELECT id, text, subr, user, url, type, date FROM models WHERE id < ? ORDER BY date DESC LIMIT 50", req.query.startid,
            function(err, row) {
                res.render('entry', {model: row}, function(err, html) {
                    models.push(html);
                });
            },
            function() {
                res.send(models);
            }
        );
    });
});

app.get('/feed', function (req, res) {
    db.serialize(function() {
        db.all("SELECT id, text, subr, user, url, type, date FROM models ORDER BY date DESC LIMIT 20", function(err, models) {
            res.render('feed', {models: models, req: req});
        });
    });
});

var server = app.listen(process.env.npm_package_config_port, function () {
    host = server.address().address;
    port = server.address().port;

    console.log('Radellite listening at http://%s:%s', host, port);
});

var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 3001 });