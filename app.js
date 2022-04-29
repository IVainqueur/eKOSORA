const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongo = require('mongoose')
const axios = require('axios')
const studentRoute = require('./routes/students')
const getInRoute = require('./routes/getIn')
const parentRoute = require('./routes/parents')
const educatorRoute = require('./routes/educators')
const announcementRoute = require('./routes/announcements')
const settingsRoute = require('./routes/settings')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const eUpload = require('express-fileupload')
// const fetch = require('node-fetch')

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
            // console.log(req.path)
            if(req.cookies.jwt == undefined){
                console.log("No jwt token")
                if(!["/logout", "/favicon"].includes(req.path)){
                    res.cookie('redirected', 'true', {
                        maxAge: 5*60*1000
                    })
                    res.cookie('from', req.path.toString(), {
                        maxAge: 5*60*1000
                    })
                }
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
let CONN_STR = process.env.DB_CONN_STR

mongo.connect(CONN_STR, (err)=>{
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
    req.body.prefix = (['student', 'parent'].includes(req.body.prefix))? '' : 'edit'
    console.log(`Sending ${req.body.prefix}Marks.html`)
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
        if(doc == null) return res.json({code: "#NoSuchID"})
        res.json({code: "#Success", doc})
    })
})

app.get('/timetable', (req, res)=>{
    res.send("<p style='text-align: center; font-size: 20px; font-family: Laksaman, sans-serif; margin-top: 30px;'>Page still under construction. <a href='/dashboard'>Click here</a> to go back</p>")
})

//=================== GOOOGLE ================================
/* 
* Here is where google authing is going to come into place
* asdsdasd


*/


const redirectURI = "/auth/google"
const querystring = require('query-string')

app.get("/auth/getURI", (req, res)=>{
    if(req.body.prefix != "educator") return res.send("This is feature is reserved only for educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.")

    console.log(getGoogleAuthURI())

    res.redirect(getGoogleAuthURI())
})

app.get(redirectURI, getUserId, async (req, res)=>{
    //decode JWT Token to get userId
    const code = req.query.code
    const allTokens = await getTokens({
        code, 
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: `${process.env.SERVER_ROOT_URI}${redirectURI}`
    })
    console.log(allTokens)
    const { id_token, access_token} = allTokens
    const googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
        headers: {
            Authorization: `Bearer ${id_token}`,
        }
        }
    )
    .then((res) => res.data)
    .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
    });
    console.log("The google user\n", googleUser)

    require('./models/ml-educator').updateOne({_id: req.body.userId}, {allTokens, googleUser}, (err, doc)=>{
        if(err) return res.send(`Failed to save your data to your account. <a href="/auth/getURI">Click here</a> to try again`)

        console.log(doc)

        return res.redirect("/dashboard")
    })


})

function getGoogleAuthURI(){
    const rootURI = "https://accounts.google.com/o/oauth2/v2/auth"
    const options = {
        redirect_uri: `${process.env.SERVER_ROOT_URI}${redirectURI}`,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        // approval_prompt: "force",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://mail.google.com"
        ].join(" ")
    }
    return `${rootURI}?${querystring.stringify(options)}`
}

function getTokens({
    code,
    clientId,
    clientSecret,
    redirectUri,
  }) {
    /*
     * Uses the code to get tokens
     * that can be used to fetch the user's profile
     */
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };
  
    return axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`);
        throw new Error(error.message);
      });
  }


app.get('*', (req, res)=>{
    res.send("<p style='text-align: center; font-size: 20px; font-family: Laksaman, sans-serif; margin-top: 30px;'>Page not found. <a href='/dashboard'>Click here</a> to go back</p>")
})

app.listen(process.env.PORT, (err)=>{
    if(err) return console.log("Something went wrong!")
    console.log("#ServerUP at "+ process.env.PORT)
})


function getUserId(req, res, next){
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, result)=>{
        if(err) return res.json({code: "#InvalidToken"})
        req.body.userId = result._id
        next()
        // console.log(result)
    })
}