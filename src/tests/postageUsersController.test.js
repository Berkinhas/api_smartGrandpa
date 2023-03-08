const request = require("supertest");
const { app } = require("../app");
const UserCommon = require("../models/UserCommon");
const UserCareviger = require("../models/UserCareviger");
const Postage = require("../models/Postage");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

var token, user;

beforeAll(async () => {
  await UserCommon.deleteMany();
  await UserCareviger.deleteMany();
  await Postage.deleteMany();

   user = await UserCommon.create({
    nome: "João",
    sobrenome: "Silva",
    email: "joao@gmail.com",
    senha: "123456",
    endereco: "Rua A, 123",
    telefone: "9999-9999",
    celular: "99999-9999",
    data_nasc: "01/01/1990",
    idade: 31,
  });

    token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: 86400,
  });
});

describe("POST /post/criar", () => {
    it("should create a new post", async () => {
        const res = await request(app)
          .post("/post/criar")
          .send({ conteudo: "Este é um novo post" })
          .set("Authorization", `Bearer ${token}`);
    
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("conteudo", "Este é um novo post");
        expect(res.body).toHaveProperty("usuario");
      });

})

describe('GET /post/meus_posts', () => {
  it('should return a 401 status code if not authenticated', async () => {
    const response = await request(app)
      .get('/post/meus_posts')

    expect(response.status).toBe(401)
  })

  it('should return the authenticated user\'s posts', async () => {
    const response = await request(app)
      .get('/post/meus_posts')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })
})

describe('GET /post', () => {
  it('should return all posts', async () => {
    const response = await request(app)
      .get('/post').set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })
})

describe('GET /post/:id', () => {
  it('should return a single post by id', async () => {
     await request(app).post('/post/criar').send({conteudo: "conteudo de teste"}).set("Authorization", `Bearer ${token}`);
    const post = user.posts[0]
    const response = await request(app)
      .get(`/post/${post._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(post)
  })
})
