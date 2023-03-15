const express = require('express')
const UserCommon = require('../models/UserCommon')
const UserCareviger = require('../models/UserCareviger')
const Files = require('../models/Files')
const multer = require('multer')
const multerConfig = require('../config/multer')
const auth = require('../middlewares/authentication')

const router = express.Router()
router.use(auth)


router.get('/', async(req, res) => {
    try {
        const user = await UserCommon.findById(req.userId) || await UserCareviger.findById(req.userId)

        res.status(200).send(user)
    } catch (err) {
        res.status(400).send({
            message: "Não foi possível mostrar seu perfil"
        })
    }
})

router.get('/lista_perfil', async(req, res) => {
    try {
        const userCommon = await UserCommon.find().populate('posts').populate('files') 
        const userCareviger = await UserCareviger.find().populate('posts').populate('files')

        res.status(200).send({
            userCommon, userCareviger
        })
    } catch (err) {
        res.status(400).send({
            message: "Não foi possível mostrar"
        })
    }
})

router.get('/:id', async(req, res) => {
    const { id } = req.params
    try {
        const user = await UserCommon.findById(id) || await UserCareviger.findById(id)

        res.status(200).send(user)
    } catch (err) {
        res.status(400).send({
            message: "Não foi possível mostrar perfil"
        })
    }
})

router.get('/foto', async (req, res) => {
    try {
        const user = await UserCommon.findById(req.userId).populate('fotos_perfil') || await UserCareviger.findById(req.userId).populate('fotos_perfil')
    
        res.status(200).send(user.fotos_perfil)

    } catch(err) {
        res.status(200).send({
            message: 'Erro ao abrir foto'
        })
    }
    
})

router.post('/foto', multer(multerConfig).single('file'), async (req, res) => {
    try {
        const { originalname: name, size, key, location: url = "" } = req.file;
    
        const file = await Files.create({
          name,
          size,
          key,
          url
        });

        const user = await UserCommon.findById(req.userId) || await UserCareviger.findById(req.userId)

        user.fotos_perfil.push(file)
        await user.save()

        return res.send(file)
    

    } catch(err) {
        return res.status(400).send({
            message: "Erro ao enviar arquivo"
        })
    }
})


router.get('/curriculo', async (req, res) => {
    try {
        const user = await UserCommon.findById(req.userId).populate('curriculo') || await UserCareviger.findById(req.userId).populate('curriculo')
    
        res.status(200).send(user.curriculo)
    } catch (err) {
        res.status(400).send({
            message: 'Erro ao abrir curriculo'
        })
    }
})

router.post('/curriculo', multer(multerConfig).single('file'), async (req, res) => {
    try {
        const { originalname: name, size, key, location: url = "" } = req.file;
    
        const file = await Files.create({
          name,
          size,
          key,
          url
        });

        const user = await UserCommon.findById(req.userId) || await UserCareviger.findById(req.userId)

        user.curriculo.push(file)
        await user.save()

        return res.send(file)
    

    } catch(err) {
        return res.status(400).send({
            message: "Erro ao enviar arquivo"
        })
    }
})

router.put('/', async (req, res) => {
    const { cpf, endereco, telefone, celular, data_nasc, idade } = req.body
    const cpfRegex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/
    
    if(!cpfRegex.test(cpf)) {
        return res.status(422).json({ message: "CPF invalido" });
    }

    try {

        if(await UserCommon.findOne({ cpf }) && await UserCareviger.findOne({ cpf })) {
            return res.status(400).send({
                message: "CPF ja cadastrado"
            })
        }


        const user = await UserCommon.findById(req.userId) || await UserCareviger.findById(req.userId)
        
        user.endereco = endereco
        user.telefone = telefone
        user.celular = celular
        user.data_nasc = data_nasc
        user.idade = idade
        user.cpf = cpf

        user.save()

        res.status(200).send({
            message: "Dados atualizados com sucesso"
        })

    } catch (error) {
        res.status(400).send({
            message: "Erro ao atualizar dados" + error
        })
    }

})

module.exports = app => app.use('/perfil', router)
