const express = require('express')
const UserCommon = require('../models/UserCommon')
const UserCareviger = require('../models/UserCareviger')
const Files = require('../models/Files')
const multer = require('multer')
const multerConfig = require('../config/multer')
const auth = require('../middlewares/authentication')

const router = express.Router()
router.use(auth)


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
    const { endereco, telefone, celular, data_nasc, idade } = req.body

    try {
        const user = await UserCommon.findById(req.userId) || await UserCareviger.findById(req.userId)
        user.endereco = endereco
        user.telefone = telefone
        user.celular = celular
        user.data_nasc = data_nasc
        user.idade = idade

        user.save()

        res.status(200).send({
            message: "Dados atualizados com sucesso"
        })

    } catch (error) {
        res.status(400).send({
            message: "Erro ao atualizar dados"
        })
    }

})

module.exports = app => app.use('/perfil', router)
