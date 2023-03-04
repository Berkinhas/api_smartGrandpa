const express = require('express')
const UserCareviger = require('../models/UserCareviger')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const { config } = require('dotenv')

config()

const router = express.Router()

const generateToken = (params = {}) => {
    return jwt.sign(params, process.env.SECRET_KEY, {
        expiresIn: 86400,
    })
}

router.post('/registrar', async (req, res) => {
    const { nome, sobrenome, email, senha, cpf, endereco, telefone, celular, data_nasc, idade, } = req.body

    const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    const cpfRegex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/


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


    if(!cpfRegex.test(cpf)) {
        return res.status(422).json({ message: "CPF invalido" });
    }

    if(await UserCareviger.findOne({ email, cpf })) {
        return res.status(400).send({
            message: 'Usuario ja existe'
        })
    }



        try {

            
            const userCareviger = await UserCareviger.create(req.body)
            
            userCareviger.senha = undefined
            

            return res.status(201).send({
                userCareviger,
                token: generateToken({ id: userCareviger.id })
            })

        } catch (error) {
            return res.status(400).send({
                message: 'error: Registration failed' + error
            })
        }
    
})


module.exports = app => app.use('/autenticacaoCuidador', router)