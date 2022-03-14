const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongo = require('mongoose')
const studentRoute = require('./routes/students')
const getInRoute = require('./routes/getIn')
const parentRoute = require('./routes/parents')
const educatorRoute = require('./routes/educators')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//middleware
app.use(bodyParser.json())
app.use(cookieParser())
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
    req.body.prefix = (req.body.prefix == 'student')? '' : 'edit'
    res.sendFile(__dirname + `/public/html/educator/${req.body.prefix}Marks.html`)
})

app.get('/subjects', (req,res)=>{
    require('./models/ml-subject').find({}, (err, doc)=>{
        if(err) return res.json({code: "#Error"})
        res.json({code: "#Success", doc})
    })
})

app.listen(process.env.PORT, (err)=>{
    if(err) return console.log("Something went wrong!")
    console.log("#ServerUP at "+ process.env.PORT)
})


let theLessons = [
    ["Web User Interface Development with HTML and CSS", "WUI"], 
    ["Web Development with PHP", "PHP"],
    ["Web Development with JavaScript", "JS"],
    ["Embedded Systems", "ES"] ,
    ["Data Structures and Algorithms", "DSA"],
    ["Fundamentals of Databases", "FOD"],
    ["Graphical User Interface Development", "GUI"],
    ["Mathematics", "MTC"],
    ["Physics", "PHY"],
    ["English", "ENG"]
]

// for(let lesson of theLessons){
//     let newLesson = require('./models/ml-subject')({
//         title: lesson[0],
//         code: lesson[1]
//     })
//     // console.log(newLesson)
//     newLesson.save((err, doc)=>{
//         if(err) return console.log("not saved %s", lesson[1])
//     })
// }

let year1 = require('./year1.json')
let newStudents = []
// for(let student of year1.Intake2021.slice(1, -1)){
//     let newStudent = {
//         names: `${student[2]} ${student[3]}`,
//         code: student[4],
//         email: student[5],
//         password: "password@123",
//         class: {
//             year: 1,
//             class: student[6]
//         }
//     }
//     // newStudents.push(newStudent)
//     let studentToSave = require('./models/ml-student')(newStudent)

//     studentToSave.save((err, doc)=>{
//         if(err) return console.log("Failed")
//         console.log("done")
//     })
// }

// console.log(newStudents)