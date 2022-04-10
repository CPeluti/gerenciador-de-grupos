// Routes
require('dotenv').config()

const login = require('./routes/login')
// Middlewares
const {validateJwt} = require('./middlewares/jwtValidation')
// Dao
const pool = require('./dao/connection')

// App Config
const express = require('express')
const app = express()
app.use(express.json())

// VarEnvs
const PORT = process.env.PORT




app.use('/', login)

app.get('/', validateJwt, async (req, res) => {
  const db = await pool.query('SELECT NOW()')

})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
