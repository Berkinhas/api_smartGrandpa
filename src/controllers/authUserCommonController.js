const express = require('express')
const UserCommon = require('../models/UserCommon')
const UserCareviger = require('../models/UserCareviger')
const jwt = require('jsonwebtoken')
const { config } = require('dotenv')

config()

const router = express.Router()

const generateToken = (params = {}) => {
    return jwt.sign(params, process.env.SECRET_KEY, {
        expiresIn: 86400,
    })
}

router.post('/registrar', async (req, res) => {
    const { nome, sobrenome, email, senha } = req.body
    
    const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/


    if (!nome) {
        return res.status(422).json({ message: "O nome é obrigatório!" });
    }

    if(!sobrenome) {
        return res.status(422).json({ message: "O sobrenome é obrigatório!" });
    }
    
    if (!email) {
        return res.status(422).json({ message: "O email é obrigatório!" });
    }
    
    if (!senha) {
        return res.status(422).json({ message: "A senha é obrigatória!" });
    }

    if(!emailRegex.test(email)) {
        return res.status(422).json({ message: "Email Invalido" });
    }


    
    try {
        
        if(await UserCommon.findOne({ email }) && await UserCareviger.findOne({ email })) {
            return res.status(400).send({
                message: 'Usuario ja existe'
            })
        }
        
        const userCommon = await UserCommon.create(req.body)
        
        
        userCommon.senha = undefined
        console.log(userCommon);

        return res.status(201).send({
            userCommon,
            token: generateToken({ id: userCommon.id })
        })
        

    } catch (error) {
        return res.status(400).send({
        message: 'error: Registration failed' + error
    })
}

})



module.exports = app => app.use('/autenticacaoComum', router)