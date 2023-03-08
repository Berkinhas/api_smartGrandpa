const request = require('supertest');
const { app } = require('../app');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserCommon = require('../models/UserCommon');
const UserCareviger = require('../models/UserCareviger');

const validUser = {
    email: "testuser@test.com",
    senha: "testpassword"
};


describe('Login', () => {
    beforeEach(async () => {
        await UserCommon.deleteMany();
        await UserCareviger.deleteMany();
        const hashedPassword = await bcryptjs.hash(validUser.senha, 10);
        await UserCommon.create({
            nome: "Rhuan",
            sobrenome: "Rorigues",
            email: "testuser@test.com",
            senha: "testpassword"
        });
    });

    describe('POST /login', () => {
        it('should return status 200 and token if user credentials are valid', async () => {
            const response = await request(app)
                .post('/login')
                .send(validUser);

            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe(validUser.email);
            expect(response.body.token).toBeDefined();
            const decodedToken = jwt.verify(response.body.token, process.env.SECRET_KEY);
            expect(decodedToken.id).toBeDefined();
        });

        it('should return status 400 if user is not found', async () => {
            const response = await request(app)
                .post('/login')
                .send({email: "a@.com", senha: "asd"});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('error: User not found');
        });

        it('should return status 400 if password is invalid', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: validUser.email,
                    senha: 'wrongpassword'
                });

            expect(response.status).toBe(400);
            expect(response.body.mensagem).toBe('error: Invalid password');
        });
    });

    describe('GET /login', () => {
        it('should return status 200 and list of users', async () => {
            const response = await request(app)
                .get('/login');

            expect(response.status).toBe(200);
            expect(response.body.UsuariosComuns.length).toBe(1);
            expect(response.body.UsuariosCuidadores.length).toBe(0);
        });
    });
});
