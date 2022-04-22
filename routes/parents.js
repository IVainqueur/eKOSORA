const express = require('express')
const app = express.Router()
const path = require("path")

app.get('/signup', (req, res)=>{
    res.sendFile(path.dirname(__dirname)+`/public/html/parent/signup.html`)
})

app.get('/getParentInfo', async (req, res)=>{
    try{
        require("../models/ml-parent").findOne({_id: req.query._id}, async (err, doc)=>{
            if(err) return res.json({code: "#Error", message: err})
            if(!doc) return res.json({code: "#NoSuchID"})
            let toSend = doc._doc
            let children = await require('../models/ml-student').find({_id: {$in: toSend.children}})
            toSend.children = children.map(x => {
                return {
                    names: x.names,
                    code: x.code,
                    email: x.email
                }
            })
            res.json({code: "#Success", doc: toSend})
        })
    }catch(e){
        res.json({code: "#Error", message: e})
    }
})

app.post('/signup', async (req, res)=>{
    if(!req.query._id) return res.json({code: "#NoID"})
    try{
        let updatedParent = await require("../models/ml-parent").updateOne({_id: req.query._id}, {
            names: req.body.names,
            tel: req.body.tel,
            password: req.body.password
        })
        if(updatedParent.matchedCount == 0) return res.json({code: "#NoSuchID"})
        res.json({code: "#Success", doc: updatedParent})
    }catch(e){
        res.json({code: "#Error", message: e})
    }
})

module.exports = app