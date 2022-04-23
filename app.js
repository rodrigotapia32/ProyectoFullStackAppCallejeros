const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const { isLoggedIn } = require('./middleware/users');

// Middlewares
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))

// Handlebars
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine', 'hbs');

// Setear la carpeta public para archivos estaticos
app.use(express.static('public'));

// Para procesar datos enviados desde forms
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

// Para parsear los cookies
app.use(cookieParser());

// Setear las rutas
app.use('/', require('./routes/routes'));
app.use('/auth', require('./routes/authentication'));
// app.use('/auth', require('./routes/auth'));
app.use('/report', isLoggedIn, require('./routes/posts'));


app.listen(3000, () => console.log("SERVER ON http://localhost:3000"));