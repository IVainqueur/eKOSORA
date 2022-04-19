const express = require('express')
const app = express.Router()

app.get('/signup', (req, res)=>{
    res.sendFile(path.dirname(__dirname)+`/public/html/parent/signup.html`)
})

module.exports = app