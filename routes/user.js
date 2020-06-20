const express = require('express');
const User = require('../models/user');
const Session = require('../models/session');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs')
const router = new express.Router();
const jwt = require('jsonwebtoken')

router.post('/signin', async function (req, res) {
   try {
    const {email, password} = req.body
    const user = await User.findOne({where: {id: email}});

    if (!user) {
        res.status(401).send({ error: "Unable to login: email or password is invalid" })
    }
    
    const isMatch = await bcrypt.compare(password, user.dataValues.password)

    if (!isMatch) {
        res.status(401).send({ error: "Unable to login: email or password is invalid" })
    } else {
        const token = await jwt.sign({ id: email.toString()}, process.env.JWT_SECRET,{ expiresIn: 3620 })
        const refreshToken = await jwt.sign({id: email.toString()}, process.env.JWT_REFRESH, { expiresIn: 4000 * 600})
        await Session.create({token, refreshToken, email})
        res.status(201).send({id:user.dataValues.id, token, refreshToken })
    }
    } catch (e) {
        res.status(401).send({ error: e.message })
    }
    
});
router.post('/signin/new_token', async function (req, res) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const session = await Session.findOne({where: { refreshToken: token}})
        const decoded = await jwt.verify(token, process.env.JWT_REFRESH)
        if(session && decoded) {
            Session.destroy({where: { refreshToken: token}});
            const Newtoken = await jwt.sign({ id: decoded.id}, process.env.JWT_SECRET,{ expiresIn: 600 })
            const refreshToken = await jwt.sign({id: decoded.id}, process.env.JWT_REFRESH, { expiresIn: 604800})
            await Session.create({token: Newtoken, refreshToken, email: decoded.id})
            res.status(201).send({ id: decoded.email, token: Newtoken, refreshToken });
        }else {
            res.status(401).send({ error: 'Please authenticate.' })
        }
    } catch (e) {
        res.status(401).send({ error: e.message })
    }
});
router.post('/signup', function (req, res) {
   User.create({ id: req.body.email, password: req.body.password })
   .then(data => {
       if(data) res.status(201).send({error: false, email: req.body.email})
   }).catch(err => {
      res.status(400).send({error: true, message: err})
   })
   
});
router.get('/info', auth, function (req, res) {
    res.status(200).send({error: false, id:req.user.id})
});
router.get('/logout', auth, function (req, res) {
    Session.destroy({where: { token: req.token}})
    .then((data) => {
        console.log(data, 'logout')
        res.status(201).send({error: false, message:'you are logout'})
    }).catch(err => {
        res.status(401).send({error: true, message: err.message})
    })
});


module.exports = router