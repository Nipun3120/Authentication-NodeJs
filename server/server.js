require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const sessions = require('client-sessions');
const bcrypt = require('bcrypt');
const app = express()
const PORT = process.env.PORT || 3030
const User = require('./models/userSchema');

mongoose.connect("mongodb://localhost/AuthDb", ()=> {
    console.log("connected to db"), 
    error=> console.error(error)
})

app.use(sessions({
    cookieName: 'session',
    secret: process.env.SECRET_KEY,
    duration: 24*60*60*1000     // 1 day
}))

app.use(express.json())

app.post('/signup', async (req, res)=> {

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    })

    
    try{
        const dbResponse = await user.save();
        console.log(dbResponse)
        res.status(201).json({'message': 'User created successfully'})
    } catch (error) {
        if(error.code === 11000) {
            res.status(400).json({"error": "Integrity error, email already registered"})
        } else {
            res.status(400).json({'error': 'User Creation failed'})
        }
    }

})

app.get('/users', async(req, res)=> {
    User.findOne({email: req.body.email}, (err, user)=> {
        if(!user || !bcrypt.compareSync(req.body.password, user.password)) {
            res.status(401).json({"error": err})
        }
        else {    
            req.session.userId = user._id
            console.log(req.session)
            res.status(200).json(user)
        }
    })
})

app.listen(PORT, ()=> console.log(`Connected to port: ${PORT}`))