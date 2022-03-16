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

module.exports = app