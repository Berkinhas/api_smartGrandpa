const express = require('express')
const UserCommon = require('../models/UserCommon')
const UserCareviger = require('../models/UserCareviger')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')


const router = express.Router()

const generateToken = (params = {}) => {
    return jwt.sign(params, process.env.SECRET_KEY, {
        expiresIn: 86400,
    })
}

router.post('/', async (req, res) => {
    const { email , senha } = req.body

    const user = await UserCareviger.findOne({ email }).select('+senha') || await UserCommon.findOne({ email }).select('+senha')

    if(!user) {
        return res.status(400).send({
            message: 'error: User not found'
        })
    }

    if(!await bcryptjs.compare(senha, user.senha)) {
        return res.status(400).send({
            mensagem: 'error: Invalid password'
        })
    }

    user.senha = undefined


    res.send({
        user,
        token: generateToken({id: user.id})
    })
})


module.exports = app => app.use('/login', router)