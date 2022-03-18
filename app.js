const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongo = require('mongoose')
const studentRoute = require('./routes/students')
const getInRoute = require('./routes/getIn')
const parentRoute = require('./routes/parents')
const educatorRoute = require('./routes/educators')
const announcementRoute = require('./routes/announcements')
const settingsRoute = require('./routes/settings')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const eUpload = require('express-fileupload')

//middleware
require('dotenv').config()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(eUpload())
app.use(express.static('public'))
app.use((req, res, next)=>{ //Cookie validation
    // console.log(req)
    // return res.send("Got it")
    if(req.originalUrl.match(/login/)) return next()
    if((req.method != 'GET')){
        if(req.cookies.jwt == undefined){
            console.log("No jwt token")
            return res.json({code: "#NoTokenNoService"})
        }else{
            jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, result)=>{
                if(err) return res.json({code: "#InvalidToekn"})
                // console.log(result)
            })
        }
        // return next()

    }
    if((req.originalUrl != "/")){
        if(!req.originalUrl.match(/login/)){
            if(req.cookies.jwt == undefined){
                console.log("No jwt token")
                return res.redirect('/login')
            }else{
                jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, result)=>{
                    if(err) return res.redirect('/login')
                    // console.log(result)
                    req.body.prefix = result.AT
                    req.body.AdP = result.AdP
                })
            }
        }
    }
    
    next()
})

app.use('/announcement', announcementRoute)
app.use('/settings', settingsRoute)
app.use('/student', studentRoute)
app.use('/educator', educatorRoute)
app.use('/parent', parentRoute)
app.use('/getin', getInRoute)
require('dotenv').config()

//Connecting to the DB
mongo.connect("mongodb://localhost:27017/eKOSORA", (err)=>{
    if(err) return console.log("Something went wrong.", err)
    console.log("#ConnectedToDB")
})

app.get('/', (req, res)=>{
    res.sendFile(__dirname + `/public/html/index.html`)
})
app.get('/login', (req, res)=>{
    res.redirect('/getin/login')
})
app.get('/logout', (req, res)=>{
    res.redirect('/getin/logout')
})
app.get('/dashboard', (req, res)=>{

    res.sendFile(__dirname + `/public/html/${req.body.prefix}/dashboard.html`)
})

app.get('/marks', (req, res)=>{
    req.body.dir = req.body.prefix
    req.body.prefix = (req.body.prefix == 'student')? '' : 'edit'
    res.sendFile(__dirname + `/public/html/${req.body.dir}/${req.body.prefix}Marks.html`)
})

app.get('/subjects', (req,res)=>{
    require('./models/ml-subject').find({}, (err, doc)=>{
        if(err) return res.json({code: "#Error"})
        res.json({code: "#Success", doc})
    })
})

app.get('/settings', (req, res)=>{
    res.sendFile(__dirname + `/public/html/${req.body.prefix}/settings.html`)
})

app.get('/getInfo/:id', (req, res)=>{
    // console.log(req.body)
    require(`./models/ml-${req.body.prefix}`).findOne({_id: req.params.id}, (err, doc)=>{
        if(err) return res.json({code: "#Error", message: err})
        if(doc == null) return res.json({code: "#NoSuchId"})
        res.json({code: "#Success", doc})
    })
})

app.get('*', (req, res)=>{
    res.send("<p style='text-align: center; font-size: 20px; font-family: Laksaman, sans-serif; margin-top: 30px;'>Page not found. <a href='/'>Click here</a> to go back</p>")
})

app.listen(process.env.PORT, (err)=>{
    if(err) return console.log("Something went wrong!")
    console.log("#ServerUP at "+ process.env.PORT)
})
