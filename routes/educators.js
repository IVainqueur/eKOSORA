const express = require('express')
const app = express.Router()
const path = require('path')


app.get('/', (req, res)=>{
    // console.log(req.body)
    if(!req.body.AdP) return res.send("This is feature is reserved only for admin educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.")

    res.sendFile(path.dirname(__dirname)+'/public/html/educator/educators.html')
})

app.get('/register', (req, res)=>{
    if(!req.body.AdP) return res.send("This is feature is reserved only for admin educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.")

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

app.get('/view', (req, res)=>{
    require('../models/ml-educator').find({}, (err, result)=>{
        if(err) return res.json({code: "#Error", message: err})
        let doc = []
        for(let {_doc: educator} of result){
            // console.dir(educator)
            let ed = {}
            Object.keys(educator).map(x=>{
                if(["__v", "password"].includes(x)) return
                return ed[x] = educator[x]
            })
            doc.push(ed)
        }
        res.json({code: "#Success", doc})
    })
})

app.get('/getOne', (req, res)=>{
    require('../models/ml-educator').findOne({_id: req.query.id}, (err, doc)=>{
        if(err) return res.json({code: "#Error", message: err})
        if(!doc) return res.json({code: "#NotFound"})
        res.json({code: "#Success", doc})
    })
})

app.get('/edit', (req, res)=>{
    if(!req.body.AdP) return res.send("This is feature is reserved only for admin educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.")
    if(!req.query.id) return res.redirect('/educator')
    res.sendFile(path.dirname(__dirname)+'/public/html/educator/editEducator.html')
    
    
})

app.post('/edit', (req,res)=>{
    if(!req.body.AdP) return res.json({code: "#NoAdminPrivileges"})
    if(!req.query.id) return res.json({code: "#NoIDProvided"})
    require('../models/ml-educator').updateOne({_id: req.query.id}, req.body.data, (err, doc)=>{
        if(err) return res.json({code: "#Error", message: err})
        res.json({code: "#Success", doc})
    })

})

app.get('/delete', (req, res)=>{
    if(!req.body.AdP) return res.json({code: "#NoAdminPrivileges"})
    if(!req.query.id) return res.json({code: "#NoIDProvided"})
    require('../models/ml-educator').deleteOne({_id: req.query.id}, (err, doc)=>{
        if(err) return res.json({code: "#Error", message: err})
        res.json({code: "#Success", doc})
    })
})

module.exports = app