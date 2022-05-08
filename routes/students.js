const express = require('express')
const app = express.Router()
const bcrypt = require('bcrypt')
const mongo = require('mongoose')
const mailer = require('nodemailer')
const {google} = require('googleapis')
const {v4: uuidGenerate} = require('uuid')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const path = require('path')


//Middleware
app.use(cookieParser())
require('dotenv').config()
process.env.TEST = 43

// let transporter =  null;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)


oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN, access_token: "ya29.A0ARrdaM926K37slBX8P2KbiCJmebffJ3z5y5jZwcOSMgbolsBcLcfLXzg956K0Hf2XJRt7VLWISZzqhcw0uNgcR51hIsb0HMkcDnI1CTMLMQfUIjxOXiyV1nClyQusUJ4FfhEX12kelJ9iMFSFdfQigUuLIBV"});


const sendMail = async (message, receiver, subject, sender, accessToken, refreshToken)=>{
    try{

        const accessToken = await oAuth2Client.getAccessToken()
        // console.log(accessToken)
        const transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'oauth2',
                user: sender,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: refreshToken,
                accessToken: accessToken
            }
        })
        const mailOptions = {
            from: `eKOSORA messages ${sender}`,
            to: receiver,
            subject: subject,
            text: message,
            html: message
        }
        const result = await transporter.sendMail(mailOptions)
        console.log(result)
        return {code: "#Success", doc: result}
    }catch(err){
        console.log(err.message)
        return {code: "#Error", message: err}
    }
}

/*
* Testing out the sendMail function 
* The most recurring error is GAxios: invalid_grant
* Another on is GaxiosError: unauthorized_client

*/

// sendMail("Testing this message on myself", "ishimvainqueur@gmail.com", "Testing shit out")


app.get('/', (req, res)=>{
    // console.log(req.body)
    if(req.body.prefix != "educator") return res.send("This is feature is reserved only for educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.")

    res.sendFile(path.dirname(__dirname)+'/public/html/educator/students.html')
})


//? THERE WILL BE COOKIE-RELATED VALIDATION
app.post('/register', async (req, res)=>{
    // req.body.password = await bcrypt.hash("password@123", Number(process.env.BCRYPT_SALT))
    let newStudent = require('../models/ml-student')(req.body)

    newStudent.save((err, doc)=>{
        if(err) return res.json({code: "#Error"})
        res.json({code: "#Success"})
    })
    // console.log(newStudent)
})

app.get('/search', (req, res)=>{
    // console.log(req.query)
    if(!req.query.name) return res.json({code: "#Error", message: "Invalid search query"})
    require('../models/ml-student').find({names: {$regex: req.query.name, $options: 'i'}}, (err, result)=>{
        if(err) res.status(500).json({code: "#Error", message: 'Something went wrong'})
        res.json(result.map((x) => {
            return {
                name: x.names,
                class: x.class,
                email: x.email,
                records: x.records

            }
        }))
    })
})

app.get('/view', (req, res)=>{
    require('../models/ml-student').find({}, (err, result)=>{
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
        // console.log(doc[0].class)
        res.json({code: "#Success", doc})
    })
})

app.get('/edit', (req, res)=>{
    // if(!req.body.AdP) return res.send("This is feature is reserved only for admin educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.")
    if(!req.query.id) return res.redirect('/student')
    res.sendFile(path.dirname(__dirname)+'/public/html/educator/editStudent.html')
    
    
})

app.get('/getOne', (req, res)=>{
    require('../models/ml-student').findOne({_id: req.query.id}, (err, doc)=>{
        if(err) return res.json({code: "#Error", message: err})
        if(!doc) return res.json({code: "#NotFound"})
        res.json({code: "#Success", doc})
    })
})

app.get('/findOne/:id', (req, res)=>{
    // console.log(req.params)
    require('../models/ml-student').findOne({_id: req.params.id}, (err, doc)=>{
        if(err) return res.json({code: "#Error", error: err})
        res.json({code: "#Success", result: (doc == null)? null : [doc].map((x) => {
            return {
                name: x.names,
                class: x.class,
                email: x.email,
                records: x.records

            }
        })[0]})
    })
})

app.get('/newRecord', (req, res)=>{
    if(req.body.prefix != "educator") return res.send("This is feature is reserved only for educators. <a href='/dashboard'>Click Here</a> To return to your dashboard.")
    
    res.sendFile(path.dirname(__dirname)+`/public/html/${req.body.prefix}/newRecord.html`)
})

app.post('/addRecord', (req, res)=>{
    req.body.date = Date.parse(new Date(req.body.date).toString().slice(0,15))
    // console.dir(req.body.reversed)
    // return res.json({code: "#Success"})
    require('../models/ml-student').updateMany({"class.year": req.body.class.year}, {$push: {records: {
        _id: mongo.Types.ObjectId(),
        recordName: req.body.recordName,
        date: req.body.date,
        mark: (req.body.reversed == "true") ? req.body.max : 0,
        max: Number(req.body.max),
        subject: req.body.subject,
        reversed: (req.body.reversed == "true") ? true : false
    }}}, (err, doc)=>{
        if(err) return res.json({code: "#Error", error: err})
        res.json({code: "#Success", doc})
    })

})

// {$and: [{names: "ISHIMWE Vainqueur"}, { records: {$elemMatch: {_id: ObjectId('6220ceeae7fe922d5b4d1e6d')}}}]}

app.post('/updateMark', (req, res)=>{
    req.body.recordId = mongo.Types.ObjectId(req.body.recordId)
    req.body.studentId = mongo.Types.ObjectId(req.body.studentId)
    // console.log(req.body)
    require('../models/ml-student').updateOne({_id: req.body.studentId, records: {$elemMatch: {_id: req.body.recordId}}}, {
        $set: {"records.$.mark": Number(req.body.mark)}
    }, (err, doc)=>{
        if(err) return res.json({code: "#Error", error: err})
        res.json({code: "#Success", doc})
    })
})

app.post('/updateForMany', getUserId, async (req, res)=>{
    try{
        let doc = []
        req.body.recID = req.body.recordId
        req.body.recordId = mongo.Types.ObjectId(req.body.recordId)

        req.body.students.forEach((studentId, index)=>{
            console.log("|",studentId, "|")
            req.body.students[index] = mongo.Types.ObjectId(studentId)
        })
        
        let theSameStudents = await require('../models/ml-student').find({_id: {$in: req.body.students}, records: {$elemMatch: {_id: req.body.recordId}}})
        theSameStudents = theSameStudents.map(x => x._doc)

        theSameStudents.forEach(async (student, i)=>{
            student.records.forEach(async (record, recIndex)=>{
                if(record._id == req.body.recID){
                    //Check if the new mark will be higher than the maximum
                    record.mark = ((Number(record.mark)+Number(req.body.mark)) >= record.max) ? record.max : (Number(record.mark)+Number(req.body.mark))
                    //Check if the new mark is not lower than zero
                    record.mark = (Number(record.mark) < 0) ? 0 : Number(record.mark)
                    doc.push(await require('../models/ml-student').updateOne({_id: student._id, records: {$elemMatch: {_id: record._id}}}, {
                        "records.$.mark": Number(record.mark)
                    }))
                    if(req.body.notifyParents){
                        let subject = await require('../models/ml-subject').findOne({code: record.subject})
                        let educator = await require('../models/ml-educator').findOne({_id: mongo.Types.ObjectId(req.body.userId)})


                        if(!educator.allTokens || !educator.googleUser) return

                        let message = `
                        <div style="width: 500px;margin: auto;margin-top: 20px; font-size: 16px;">
                            <div style="background: #4CA7CE;padding: 10px;">
                                <img src="https://res.cloudinary.com/dyrneab5i/image/upload/v1651304384/output-onlinepngtools_47_ylmye4.png" style="display: block;" height="45" width="150" title="eKOSORA Logo" alt="eKOSORA" />
                            </div>
                            <div style="padding: 10px;background: #f0f0f0;">
                                Dear Sir/Madam <br><br> ${student.names} has ${(Number(req.body.mark) > 0) ? 'gained' : 'lost'}
                                ${Math.abs(Number(req.body.mark))} mark(s) in ${subject.title}
                                ${(req.body.messageAttached) ? `. <br><b>Reason</b>: ${req.body.messageAttached}.<br>`: ''}  
                                For more information, you can contact the teacher in charge of the course in question.
                                <br>
                                <p style="text-align: end; padding-right: 15px;">${new Date().toString().slice(0, 21)}</p>
                            </div>
                        </div>`

                        console.log("This is the ID", req.body.userId)
                        console.log(subject, message, educator.allTokens.access_token)
                        sendMail(message, student.parentEmails, "Student's marks adjustment", educator.googleUser.email, educator.allTokens.access_token, educator.allTokens.refresh_token)
                    }
                }
            })
        })
        res.json({code: "#Success", doc})

    }catch(err){
        console.log(err)
        res.json({code: "#Error", message: err})
    }
})

app.get('/getRecords/', (req, res)=>{
    console.log(`{class: {year: ${req.query.year}, class: "${req.query.class}"}`)

    require('../models/ml-student').find({$and: [{"class.class": req.query.class}, {"class.year": Number(req.query.year)}]}, (err, doc)=>{
        if(err) return res.json({code: "#Error", message: err})

        // console.log("Here we sort through the results and give only the desired one")
        if(doc.length == 0) return res.json({code: "#Success", doc})

        let records = []
        for(let i=0; i < doc.length; i++){
            let student = doc[i]
            let info = {studentId: student._id, studentName: student.names, records: []}
            for(let record of student.records){
                // console.log(record.subject, req.query.subject)
                if(record.subject == req.query.subject){
                    info.records.push(record)
                }
            }
            records.push(info)
        }

        res.json({code: "#Success", records})
    }).sort({"names": 1})
})

app.get('/deleteRecord', async (req, res)=>{
    console.log(req.query._id)
    try{
        let deleteRecord = await require('../models/ml-student').updateMany({"records": {$elemMatch: {"_id": mongo.Types.ObjectId(req.query._id)}}}, {$pull: {"records": {"_id": mongo.Types.ObjectId(req.query._id)}}})
        console.log(deleteRecord)
        res.json({code: "#Success"})
    }catch(err){
        console.log(err)
        res.json({code: "#Error", message: err})
    }
})

app.post('/addParent', async (req, res)=>{
    try{
        let student = await require('../models/ml-student').findOne({_id: req.body.studentId})
        if(student.parentEmails.includes(req.body.email)) return res.json({code: "#Success"})

        student = await require('../models/ml-student').updateOne({_id: req.body.studentId}, {$push: {parentEmails: req.body.email}})

        if(student.matchedCount == 0){
            return res.json({code: "#Error", summary: "There is no student with such an ID"})
        }
        let existingParent = await require('../models/ml-parent').findOne({email: req.body.email})
        if(!existingParent){
            let newParent = require('../models/ml-parent')({
                names: '',
                email: req.body.email,
                tel: '',
                children: [req.body.studentId]
            })
            newParent.save( async (err, result)=>{
                console.log(err)
                if(err) return res.json({code: "#Error", message: err})
                
                // let newCode = require('../models/ml-newAccountCode')({
                //     userId: result._id,
                //     code: uuidGenerate()
                // })

                // let saveNewCode = await newCode.save()

                let text = `
                <div style="width: 500px;margin: auto;margin-top: 20px; font-size: 16px;">
                    <div style="background: #4CA7CE;padding: 10px;">
                        <img src="https://res.cloudinary.com/dyrneab5i/image/upload/v1651304384/output-onlinepngtools_47_ylmye4.png" style="display: block;" height="45" width="150" title="eKOSORA Logo" alt="eKOSORA" />
                    </div>
                    <div style="padding: 10px;background: #f0f0f0;">
                        Dear Sir/Madam, the student ${req.body.studentName} at Rwanda Coding Academy has registered you as their parent or guardian under this email on eKOSORA platform. To confirm and finish setting up your parent account,  <a href="https://ekosora.herokuapp.com/parent/signup?_id=${result._id}">Click Here</a> 
                        <br>
                        <p style="text-align: end; padding-right: 15px;">${new Date().toString().slice(0, 21)}</p>
                    </div>
                </div> 
            `

                sendMail(text, req.body.email, "Registered as parent", "ishimvainqueur@gmail.com", process.env.ADMIN_ACCESS_TOKEN, process.env.ADMIN_REFRESH_TOKEN)
                
                
                res.json({code: "#Success"})
        
            })
        }else{
            require('../models/ml-parent').updateOne({_id: existingParent._id}, {$push: {children: req.body.studentId}}, (err, doc)=>{
                if(err) return res.json({code: "#Error", message: err})
                return res.json({code: "#Success", result: doc})
            })
        }
    }
    catch(err){
        return res.json({code: "#Error", message: err})
    }
})

app.get('/getMarks', async (req, res)=>{
    try{
        let marks = await require('../models/ml-student').find({_id: {$in: req.query.ids.split(',')}})
        if(marks.length == 0) return res.json({code: "#NoSuchID"})
        marks = marks.map(x => x._doc).map(x => {
            return {
                records: x.records,
                names: x.names
            }
        })

        res.json({code: "#Success", doc: marks})
    }catch(e){
        res.json({code: "#Error", message: e})
    }
})


app.post('/getSummary', async (req, res)=>{
    if((req.body.lessons.length == 0) || !req.body.lessons) return res.json({code: "#EmptyLessonsList"})

    try{
        //First check for the classes that have those lessons
        let years = await require("../models/ml-academicLevel").find({lessons: {$elemMatch: {$in: req.body.lessons}}})
        console.log(years.map(x => x.year))
        let students = await require('../models/ml-student').find({"class.year": {$in: years.map(x => x.year)}})
        console.log(students.length)

        //TODO: Filtering out the unneeded data

        let filteredStudents = []
        let unwantedKeys = ["__v", "_id", "password", "parentEmails"]

        for(let student of students.map(x => x._doc)){
            let newStudent= {}
            Object.keys(student).map(x =>{
                if(!unwantedKeys.includes(x)) {
                    if(x == "records"){
                        let wantedRecords = []
                        for(let record of student["records"]){
                            if(req.body.lessons.includes(record.subject)) wantedRecords.push(record)
                        }
                        return newStudent[x] = wantedRecords
                    }
                    newStudent[x] = student[x]

                }
            })
            filteredStudents.push(newStudent)

        }

        students = filteredStudents

        

        let classified = {}

        //Adding the years as keys to the classified array
        for(let year of years){
            classified[year.year.toString()] = {}
            for(let classLetter of year.classes){
                classified[year.year.toString()][classLetter] = []
            }
        }
        //add the each student to their respective year and class
        for(let student of students){
            classified[student.class.year.toString()][student.class.class].push(student)
        }

        
        res.json({code: "#Success", doc: classified})
    }catch(e){
        console.log(e)
        res.json({code: "#Error", message: e})
    }
    
});



// (async function(){
//     const result = await require('../models/ml-student').aggregate([
//         {$sum: [2, 5]}
//     ]);
    
//     console.log(result)    ;
// })()

function getUserId(req, res, next){
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, result)=>{
        if(err) return res.json({code: "#InvalidToken"})
        req.body.userId = result.userId
        next()
        // console.log(result)
    })
}


// require('../models/ml-educator').findOne({_id: ("6256809c694faff4d7ad762b")}, (err, data)=>{
//     console.log(err, data)
// })

module.exports = app