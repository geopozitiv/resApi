const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const db = require('../db')
const router = new express.Router()

router.post('/signin', async function (req, res) {
    const {email, password} = req.body.email
    const user = await User.findOne({where: {id: email,}});
    if (!user) {
        throw new Error('Unable to login: email or password is invalid')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
            throw new Error('Unable to login: email or password is invalid')
    } else {
        const token = await jwt.sign({ id: user.email.toString()}, process.env.JWT_SECRET,{ expiresIn: 60 })
        const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: 360})
            
        res.status(201).send({ user, token });
    }
    
    return user
    
    
});
router.post('/signin/new_token', auth, function (req, res) {
    res.send('rest api')
});
router.post('/signup', function (req, res) {
   User.create({ id: req.body.email, password: req.body.password })
   .then(data => {
       if(data) res.status(201).send({error: false, email: req.body.email})
   }).catch(err => {
      res.status(400).send({error: true, message: err})
   })
   
});
router.get('/info', function (req, res) {
    User.findAll({ limit: 10 })
    .then(data => {
        res.send(data)
    })
   
});
router.get('/logout', auth, function (req, res) {
    res.send('rest api')
});


module.exports = router