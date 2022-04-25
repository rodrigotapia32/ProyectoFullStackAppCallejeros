// Entry point / root level
// Raiz principipal, este es el primer archivo que se ejecuta
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const { isLoggedIn } = require('./middleware/users');
const flash = require('express-flash');
const upload = require('express-fileupload');

app.use(flash())

// Configuracion express-fileupload
app.use(upload({
  limits: { fileSize: 5000000 },
  abortOnLimit: true,
  responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
}));

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

// Setear las rutas
app.use('/', require('./routes/routes'));
app.use('/auth', require('./routes/authentication'));
app.use('/report', isLoggedIn, require('./routes/posts'));

app.listen(3000, () => console.log("SERVER ON http://localhost:3000"));