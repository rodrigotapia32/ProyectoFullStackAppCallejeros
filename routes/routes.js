const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllers.js')

router.get('/', (req, res) => {
    res.render('home')
})

router.get('/adopt', (req, res) => {
    res.render('adopt')
})

// router.get('/report', (req, res) => {
//     res.render('report')
// })

router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/login', controller.login)

router.get('/register',(req, res) => {
    res.render('register')
})

router.post('/register', controller.registerUser)

router.get('/profile', (req, res) => {
    res.render('profile')
})

router.get('/post', (req, res) => {
    res.render('post')
})

module.exports = router