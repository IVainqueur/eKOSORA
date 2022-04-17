const express = require('express')
const mongo = require('mongoose')
const app = express.Router()
const cloudinary = require('cloudinary').v2
const path = require('path')


require('dotenv').config()

// console.log({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.get('/', (req, res)=>{
    res.sendFile(path.dirname(__dirname) + `/public/html/${req.body.prefix}/settings.html`)
})

app.post('/newProfile', (req, res)=>{
    // console.log(req.read())
    // console.log(req.body)
    // console.log(req.body)
    // return res.json({code: "#Success"})
    // console.log(req.files.file)
    cloudinary.uploader.upload_stream({format: req.files.file.mimetype.split('/')[1]}, async (err, doc)=>{
        if(err) return res.json({code: "#Error", message: err})
        console.log(doc.url)
        let updatedUserProfile = await require(`../models/ml-${req.body.prefix}`).updateOne({_id: mongo.Types.ObjectId(req.body._id)}, {profileLink: doc.url})
        res.json({code: "#Success", url: doc.url})
    }).end(req.files.file.data)
})

app.post('/updateSettings/:id', async (req, res)=>{
    require(`../models/ml-${req.body.prefix}`).updateOne({_id: req.params.id}, req.body, async (err, doc)=>{
        if(err) return res.json({code: "#Error", message: err})
        // console.log(doc)
        try{
            let newUser = await require(`../models/ml-${req.body.prefix}`).findOne({_id: req.params.id})
            if(!newUser) return res.json({code: "#NoSuchID"})
            // console.log(req.body.accountType)
            // console.log(req.body)

            res.json({code: "#Success", doc: {
                names: newUser.names,
                _id: newUser._id,
                code: newUser.code,
                email: newUser.email,
                title: newUser.title,
                tel: newUser.tel,
                parentEmails: newUser.parentEmails,
                lessons: newUser.lessons,
                class: newUser.class,
                profileLink: newUser.profileLink,
                accountType: req.body.prefix

            }})
        }catch(e){
            return res.json({code: "#Error", message: e})
        }
    
        })
})

app.get('/otherSettings', (req, res)=>{
    if(!req.body.AdP) return res.json({code: "#Success", doc: []})
    require('../models/ml-setting').find({}, (err, doc)=>{
        if(err) res.json({code: "#Error", message: err})
        // console.log(typeof doc[0].value.value.start)
        let result = [].concat(doc)
        doc = []
        for(let setting of result){
            for(let value of Object.keys(setting.value.value)){
                setting.value.value[value] = {
                    data: setting.value.value[value],
                    type: Object.prototype.toString.call(setting.value.value[value]).slice(1, -1).split(' ')[1]
                }
            }
            doc.push(setting)
        }
        // console.log(doc1[0].value.value)
        res.json({code: "#Success", doc})
    })
})

app.post("/addSubject", (req, res)=>{
    let newSubject = require('../models/ml-subject')({
        title: req.body.title,
        code: req.body.code
    })
    newSubject.save((err)=>{
        if(err) return res.json({code: "#Error", message: err})
        res.json({code: "#Success"})
    })
})

module.exports = app