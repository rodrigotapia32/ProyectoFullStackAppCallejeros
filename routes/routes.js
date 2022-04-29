// Rutas principales
const express = require('express');
const router = express.Router();
const conexion = require('../database/db');
const nodemailer = require('nodemailer');
const { validateRegisterContact } = require('../middleware/contact')

// Configuracion nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'desafiolatamprueba@gmail.com',
        pass: 'Alejandro32',
    },
})

// Ruta que renderea la pagina principal
// http://localhost:3000/
router.get('/', (req, res) => {
    res.render('home');
})

// Ruta que renderea todos los callejeros reportados
// http://localhost:3000/adopt
router.get('/adopt', (req, res) => {
    conexion.query('SELECT * FROM posts;', (err, result) => {
        const posts = result.rows
        res.render('adopt', { posts })
    })
})

// Ruta que muestra un formulario para enviar un correo de contacto
// http://localhost:3000/contact
router.get('/contact', (req, res) => {
    res.render('contact')
})

// Ruta que recibe los datos para enviar un correo de contacto
// http://localhost:3000/contact
router.post('/contact', validateRegisterContact, (req, res) => {
    const { first_name, email, subject, message } = req.body;
    const contact = { first_name }
    const mailOptions = {
        from: 'desafiolatamprueba@gmail.com',
        to: 'desafiolatamprueba@gmail.com',
        subject,
        html: `<h1>el usuario ${first_name} ${email} ha enviado el mensaje: ${message}</h1>`
    }
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) console.log(err)
        if (data) console.log(data)
    })
    res.render('thanks', { contact })
})


module.exports = router