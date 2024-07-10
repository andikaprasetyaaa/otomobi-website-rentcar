const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const port = 6001;


mongoose.connect('mongodb://127.0.0.1:27017/rentcar', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to the database'));


//mildware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});


//template engine
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))

//routes
app.use('', require('./routers/routes'))

app.listen(port, () => console.log(`Server is Listening on port ${port}`));