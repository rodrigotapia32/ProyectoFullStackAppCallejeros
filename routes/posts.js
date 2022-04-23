// almacenar posts
const express = require('express');
const router = express.Router();
const conexion = require('../database/db')
const upload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const { isLoggedIn } = require('../middleware/users');


//Configurar express-fileupload
router.use(upload({
  limits: { fileSize: 5000000 },
  abortOnLimit: true,
  responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
}));

// Ruta para mostrar el formulario de registro de un callejero
router.get('/add', (req, res) => {
  res.render('posts/post')
})

// Ruta que permite agregar un callejero
router.post('/add', async (req, res) => {
  try {
    const id = req.user.id
    const errors = []
    const { address, description } = req.body;
    if (!address || !description || !req.files || !req.files.foto) {
      errors.push({ message: "Debes ingresar todos los datos" })
      res.render('posts/post', { errors })
    } else {
      const file = req.files.foto;
      const fotoUuid = uuidv4() + '.jpg'
      file.mv(`${__dirname}/../public/img/${fotoUuid}`, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log("Archivo Subido con exito")
        }
      })
      await conexion.query(`INSERT INTO posts(photo, address, description, userId)
    VALUES($1, $2, $3, $4)`, [fotoUuid, address, description, id], (error, results) => {
        if (error) { console.log(error) }
      });
      res.redirect('/report')
    }
  } catch (error) {
    console.log(error)
  }
})

// Ruta que permite mostrar todos los callejeros reportados
router.get('/', async (req, res) => {
  const results = await conexion.query(`SELECT * FROM posts WHERE userId='${req.user.id}'`);
  const posts = results.rows;
  res.render('posts/list', { posts });
})

// Ruta que permite eliminar un callejero
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params
  await conexion.query(`DELETE FROM posts WHERE id='${id}'`)
  res.redirect('/report')
})

// Ruta que permite mostrar un posts para editar un callejero
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const results = await conexion.query(`SELECT * FROM posts WHERE id='${id}'`)
  const posts = results.rows
  res.render('posts/edit', { posts: posts[0] })
})

// Ruta que permite editar un post en base a su id
router.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { address, description } = req.body;
  const file = req.files.foto;
  const fotoUuid = uuidv4() + '.jpg'
  file.mv(`${__dirname}/../public/img/${fotoUuid}`, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Archivo Subido con exito")
    }
  })
  await conexion.query(`UPDATE posts SET photo='${fotoUuid}', address='${address}', description='${description}' 
  WHERE id='${id}'`)
  res.redirect('/report')
})


module.exports = router;