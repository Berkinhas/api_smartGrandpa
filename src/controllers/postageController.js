const express = require('express')
const UserCommon = require('../models/UserCommon')
const UserCareviger = require('../models/UserCareviger')
const Postage = require('../models/Postage')
const auth = require('../middlewares/authentication')


const router = express.Router()

router.use(auth)

router.get('/meus_posts', async (req, res) => {

    try {
        const user = await UserCommon.findById(req.userId).populate('posts') || await UserCareviger.findById(req.userId).populate('posts')
    
        res.status(200).send(user.posts)

    } catch(err) {
        res.status(400).send({
            message: "Erro ao mostrar meus posts"
        })
    }


})

router.get('/', async (req, res) => {
    try {
        const posts = await Postage.find()
    
        return res.status(200).send(posts)

    } catch (err) {
        return res.status(400).send({
            message: "Erro ao mostrar posts"
        })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const post = await Postage.findById(id).populate('usuario')

    return res.send(post)

})

router.post('/criar', async (req, res) => {
    const { conteudo } = req.body
    
    try {

        const post = await Postage.create({
            conteudo, usuario: req.userId
        })
        
        
        const user = await UserCommon.findById(req.userId) || await UserCareviger.findById(req.userId)
            
        user.posts.push(post)
        await user.save()
        return res.send(post)
    } catch (err) {
        return res.status(401).send("Erro ao criar postagem !")
    }
})


router.delete('/excluir/:id', async (req, res) => {
    const { id } = req.params

    try {

        const user = await UserCommon.findById(req.userId) || await UserCareviger.findById(req.userId)
        
        user.posts.filter(item => (item !== id))

        const post = await Postage.findById(id)
        await post.remove()
    
        return res.status(200).send({
            message: "Post excluido com sucesso"
        })

    }catch(err) {
        return res.status(400).send({
            error: "Falha ao excluir postagem !!" + err
        })
    }
    
})

router.put('/alterar/:id', async (req, res) => {
    const { conteudo } = req.body
    const { id } = req.params

    try {
        const post = await Postage.findById(id)

        post.conteudo = conteudo

        post.save()
    
        res.status(200).send({
            message: "Postagem alterada com sucesso !"
        })

    } catch (err) {
        console.log(err);
    }
})


module.exports = app => app.use('/post', router)