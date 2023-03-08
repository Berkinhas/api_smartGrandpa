const request = require('supertest')
const { app } = require('../app')
const UserCommon = require('../models/UserCommon')




describe('Registration', () => {
    beforeEach(async () => {
        await UserCommon.deleteMany({})
    })

    it('should register a new User.', async () => {
        const res = await request(app)
            .post('/autenticacaoComum/registrar')
            .send({
                nome: 'John',
                sobrenome: 'Doe',
                email: 'johndoe@email.com',
                senha: 'password',
                endereco: 'Rua dos bobos',
                telefone: '12345678',
                celular: '0987654321',
                data_nasc: '01/01/2000',
                idade: '21'
            })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('userCommon')
            expect(res.body).toHaveProperty('token')
            
    })
})

describe('Login', () => {
    beforeEach(async () => {
        await UserCommon.deleteMany({})

        await request(app)
            .post('/autenticacaoComum/registrar')
            .send({
                nome: 'John',
                sobrenome: 'Doe',
                email: 'johndoe@email.com',
                senha: 'password',
                endereco: 'Rua dos bobos',
                telefone: '12345678',
                celular: '0987654321',
                data_nasc: '01/01/2000',
                idade: '21'
            })
    })

    it('should authenticate a User.', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: 'johndoe@email.com',
                senha: 'password',
            })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('user')
            expect(res.body).toHaveProperty('token')
            
    })
})



