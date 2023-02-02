const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const swagger = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use("/api-docs", swagger.serve, swagger.setup(swaggerFile))


require('./controllers/authUserCommonController')(app)
require('./controllers/authUserCarevigerController')(app)
require('./controllers/uploadFilesController')(app)
require('./controllers/postageController')(app)
require('./controllers/loginUsersController')(app)
require('./controllers/forgotPasswordController')


module.exports = { app }