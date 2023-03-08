const request = require('supertest')
const { app } = require('../app')
const UserCareviger = require('../models/UserCareviger')




describe('Registration', () => {
    beforeEach(async () => {
        await UserCareviger.deleteMany({})
    })

    it('should register a new User Careviger.', async () => {
        const res = await request(app)
            .post('/autenticacaoCuidador/registrar')
            .send({
                cpf: "122.122.122-31",
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

            expect(res.statusCode).toEqual(201)
            expect(res.body).toHaveProperty('userCareviger')
            expect(res.body).toHaveProperty('token')
            
    })
})

describe('Login', () => {
    beforeEach(async () => {
        await UserCareviger.deleteMany({})

        await request(app)
            .post('/autenticacaoCuidador/registrar')
            .send({
                cpf: "122.122.122-31",
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

    it('should register a new User.', async () => {
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



