const express = require('express')
const app = express.Router()
const path = require('path')


app.get('/register', (req, res)=>{
    if(req.body.prefix != "educator") return res.send("This is feature is reserved only for educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.")

    res.sendFile(path.dirname(__dirname)+'/public/html/educator/registerEducator.html')
})

app.post('/register', (req, res)=>{
    // console.log(req.body)
    // return res.json({code: "#Success"})
    if((req.body.prefix != 'educator') || !req.body.AdP) return res.json({code: "#NoPrivileges", message: "This feature is reserved for admin educators"})
    
    const newEducator = require('../models/ml-educator')({
        names: req.body.names,
        code: req.body.code,
        title: req.body.title,
        lessons: req.body.lessons,
        email: req.body.email,
        tel: req.body.tel,
        password: "password@123"
    })
    newEducator.save((err, doc)=>{
        if(err) return res.json({code: "#Error", message: err})
        res.json({code: "#Success", doc})
    })
})

module.exports = app