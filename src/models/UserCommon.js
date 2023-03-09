const mongoose = require('../database/index')
const { v4: uuidv4 } = require('uuid')
const bcryptjs = require('bcryptjs')


const UserCommonSchema = new mongoose.Schema({
    cpf: {
        type: String,
        unique: false
    },
    nome: String,
    sobrenome: String,
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: true,
        select: false
    },
    endereco: String,
    telefone: String,
    celular: String,
    data_nasc: Date,
    idade: Number,
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: String,
        select: false
    },
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Postage'}],
    fotos_perfil: [{type: mongoose.Schema.Types.ObjectId, ref: 'Files'}],
    curriculo: [{type: mongoose.Schema.Types.ObjectId, ref: 'Files'}],
    data_criada: {
        type: Date,
        default: Date.now
    }
})

UserCommonSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('senha')) {
      user.senha = await bcryptjs.hash(user.senha, 10)
    }

    next()
  })


const UserCommon = mongoose.model('UserCommon', UserCommonSchema)

module.exports = UserCommon
