const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const upload = require('express-fileupload');

// Handlebars
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
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
app.use('/report', require('./routes/posts'));

//Configurar express-fileupload
app.use(upload({
  limits: { fileSize: 5000000 },
  abortOnLimit: true,
  responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
}));

app.listen(3000, () => console.log("SERVER ON http://localhost:3000"));