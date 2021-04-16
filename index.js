const express = require('express');
const fs = require('fs');
const nodemailer = require("nodemailer");
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');

let data = []
if (fs.existsSync('./users.json')) {
    data = require('./users.json')
}

const PORT = process.env.PORT || 5000

const app = express()
// console.log(data);
app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`)
})
app.use(express.static('public'))
app.set('view engine', 'ejs')
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(express.json())
app.get('/', (req, res) => {
    res.render('pages/index')
})


app.post('/send', (req,res)=> {

    // console.log(`send - main access from:  ${req.body.email}`);

    res.send(`send - main access from:  ${req.body.email}`)
})

app.post('/new', (req,res)=> {

    // console.log(`send - main access from:  ${req.body.email}`);
    let testJson = JSON.stringify(data)
    let testJson_id = JSON.stringify(data[0].id)


    let myJson = JSON.parse(fs.readFileSync('./users.json', 'utf8'))
        // console.log(myJson)

    const createID = uuidv4()
    const verificationID = uuidv4()


    let newUser = {
        id: Number(data.length+1),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        confirmationCode: verificationID,
        password: req.body.password,
        active: "pending"
    }
    // console.log(newUser);

    myJson.push(newUser)
    console.log(myJson);

    fs.writeFile('./users.json', JSON.stringify(myJson), (err) => {
        if (err) throw err
        console.log('updated')
        fs.readFile('./users.json', 'utf8', (err, newData) => {
            data = JSON.parse(newData)
            // console.log(data);
            res.redirect('/login')
        })
    })
    // res.send(`
    // Vorname: ${req.body.firstName},<br/>
    // Nachname: ${req.body.lastName},<br/> 
    // Email: ${req.body.firstName},<br/>
    // password: ${req.body.firstName},<br/>
    // ID: SOON,<br/>
    // VERIFY ID: SOON,<br/>
    // activ: "pending",<br/> 
    // JSON below:,<br/> 
    // json: ${testJson},<br/> 
    // json parsed: ${myJson},<br/> 
    // json_ID: ${testJson_id},<br/> 
    // json_name: ${JSON.stringify(data[0].firstName)},<br/>            
    
    // ` 
    // );

    // res.send(`send - main access from:  ${req.body.email}`)
})


app.get("/login", (req, res) => {
    res.render("pages/login")
})

app.post("/login/infos", (req, res) => {
    // res.send(req.body.email)

    let loginEmail = req.body.email
    let loginPassword = req.body.password
    // console.log(loginEmail);

    let c = ""

    data.forEach(elm => {
        if(loginEmail==elm.email && loginPassword == elm.password){
            return c = "in"
        } 
    
        return c = "not"
    });

    // res.redirect("/secret")
    // console.log(c);

    if (c=="not"){
        res.redirect('/')
    } else {
        res.redirect("/secret")
    }
})

app.get("/secret", (req, res)=>{
    res.render("pages/secret")
})