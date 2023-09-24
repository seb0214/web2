var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var pizzaRouter = require('./routes/pizzas');

var app = express();

const requete = {};

app.use((req, res, next) => {
    const path = req.path;

    if (!requete[path]) {
        requete[path] = 1;
    } else {
        requete[path]++;
    }

    console.log('Request counter :')

    for (const path in requete) {
        console.log('- GET ' + path + ' : ' + requete[path]);
    }

    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pizzas', pizzaRouter);

module.exports = app;
