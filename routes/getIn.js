const express = require('express')
const app = express.Router()
const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')


app.use(cookieParser())


app.get('/', (req, res)=>{
    res.redirect('/getin/login')
})
app.get('/logout', (req, res)=>{
    res.cookie('jwt', '', {maxAge: 0})
    res.send({code: "#Success"})
})
app.get('/login', (req, res)=>{
    // console.log(process.env.JWT_SECRET)
    // res.cookie('jwt')
    res.sendFile(path.dirname(__dirname) + '/public/html/login.html')
})
app.post('/login/check', async (req, res)=>{
    // console.log(req.body)
    try{
        let user = null
        if(req.body.accountType == 'student'){
            user = await require(`../models/ml-${req.body.accountType}`).findOne({code: {$regex: new RegExp(req.body.code, "i") }})
        }else{
            user = await require(`../models/ml-${req.body.accountType}`).findOne({email: req.body.code})
        }
        if(!user) return res.json({code: "#NoSuchUser" })
        // console.log(user)
        let correctPassword = (req.body.password === user.password)
        // let correctPassword = await bcrypt.compare(req.body.password, user.password)
        // console.log("Reached here")
        if(!correctPassword) return res.json({code: "#InvalidPassword" })
        let token = jwt.sign({AT: req.body.accountType, AdP: (user.title === 'admin')}, process.env.JWT_SECRET)
        res.cookie('jwt', token, {
            maxAge: 7200000
        })
        
        return res.json({code: "#Success", doc: {
            names: user.names,
            title: req.body.accountType
        }})
    }
    catch(e){
        return res.json({code: "#Error", message: e})
    }
    // if(bcrypt.compare())
})


module.exports = app