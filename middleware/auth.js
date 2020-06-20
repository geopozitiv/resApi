const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Session = require('../models/session');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const session = await Session.findOne({where: { token: token}})
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        if(session.dataValues.token === token) {
            const user = await User.findOne({where: { id: decoded.id}})
            if (!user.dataValues) {
                throw new Error()
            }
            req.token = token
            req.user = user.dataValues
            next()
        }else{
            res.status(401).send({error: true, message: "Please authenticate."})
        }

    } catch (e) {
        res.status(401).send({error: true, message: "Please authenticate.", e: e.message})
    }
}

module.exports = auth