// almacenar posts
const express = require('express');
const router = express.Router();
const conexion = require('../database/db')

router.get('/add', (req, res) => {
  res.render('posts/post')
})

router.post('/add', async (req, res) => {
  const { foto, address, description } = req.body;
  await conexion.query(`INSERT INTO posts(photo, address, description)
  VALUES($1, $2, $3)`, [foto, address, description], (error, results) => {
    if(error){console.log(error)}
  });
  res.send('recibido')
})

router.get('/', async (req, res) => {
  const results = await conexion.query('SELECT * FROM posts');
  const posts = results.rows
  res.render('posts/list', { posts })
})


module.exports = router;