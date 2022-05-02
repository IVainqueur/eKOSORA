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
            user = await require(`../models/ml-${req.body.accountType}`).findOne({code: {$regex: new RegExp((`\\b${req.body.code}\\b`), "i") }})
        }else{
            user = await require(`../models/ml-${req.body.accountType}`).findOne({email: req.body.code})
        }
        if(!user) return res.json({code: "#NoSuchUser" })
        // console.log(user)
        let correctPassword = (req.body.password === user.password)
        // let correctPassword = await bcrypt.compare(req.body.password, user.password)
        // console.log("Reached here")
        if(!correctPassword) return res.json({code: "#InvalidPassword" })
        let token = jwt.sign({AT: req.body.accountType, AdP: (user.title === 'admin'), userId: user._id}, process.env.JWT_SECRET)
        res.cookie('jwt', token, {
            maxAge: 7200000
        })
        let children = []
        if(req.body.accountType == 'parent'){
            children = await require('../models/ml-student').find({_id: {$in: user.children}})
            children = children.map(x => {
                return {
                    names: x.names,
                    code: x.code,
                    email: x.email,
                    _id: x._id
                }
            })
        }
        
        return res.json({code: "#Success", doc: {
            names: user.names,
            // title: req.body.accountType,
            _id: user._id,
            code: user.code,
            email: user.email,
            title: user.title,
            tel: user.tel,
            parentEmails: user.parentEmails,
            lessons: user.lessons,
            class: user.class,
            profileLink: user.profileLink,
            accountType: req.body.accountType,
            children: (children.length != 0) ? children : null

        }})
    }
    catch(e){
        console.log(e)
        return res.json({code: "#Error", message: e})
    }
    // if(bcrypt.compare())
})


module.exports = app