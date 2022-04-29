// Rutas principales
const express = require('express');
const router = express.Router();
const conexion = require('../database/db');

router.get('/', (req, res) => {
    res.render('home');
})

router.get('/adopt', (req, res) => {
    conexion.query('SELECT * FROM posts;', (err, result) => {
        const posts = result.rows
        res.render('adopt', { posts })
    })
})


module.exports = router