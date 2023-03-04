const express = require('express')
const UserCareviger = require('../models/UserCareviger')
const UserCommon = require('../models/UserCommon')
const crypto = require('crypto')
const mailer = require('../modules/mailer')



const router = express.Router()

router.post('/', async (req, res) => {
    const { email } = req.body

    try {
        const user = await UserCareviger.findOne({ email }) || await UserCommon.findOne({ email })

        if(!user) {
            res.status(401).send({
                message: 'Usuario não existe !'
            })
        }

        const token = crypto.randomBytes(2).toString('hex')

        const now = new Date()

        now.setHours(now.getHours() + 1)
        
        user.passwordResetToken = token
        user.passwordResetExpires = now
        await user.save()

         mailer.sendMail({
            to: email,
            from: "0000872054@senaimgaluno.com.br",
            subject: 'Recuperar senha',
            template: 'forgot_password',
            context: { token }
        }), (err) => {
            if(err) {
                return res.status(400).send({ error: 'Cannot send forgot password email'})
            }

            return res.send()
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Erro on forgot password, try again !'})
    }
})


router.post('/mudar_senha', async (req, res) => {
    const { email , token, senha } = req.body

    try {
        const user = await UserCommon.findOne({email}).select('+passwordResetToken passwordResetExpires') || await UserCareviger.findOne({email}).select('+passwordResetToken passwordResetExpires')

        if(!user) 
            return res.status(400).send({ error: 'Usuário não encontrado em nossa base de dados'});

        if(token !== user.passwordResetToken)
            return res.status(400).send({ error: 'O token informado não é valido'});

        const now = new Date()

        if(now > user.passwordResetExpires)
            return res.status(400).send({ error: 'O tokken espirou'});

        user.senha = senha

        await user.save()

        return res.status(200).send({ status: 'Senha alterada com sucesso'});

    } catch (error) {
        return res.status(400).send({ error: 'Não foi possivel alterar sua senha, tente novamente mais tarde'});
    }
})


module.exports = app => app.use('/recuperar', router)