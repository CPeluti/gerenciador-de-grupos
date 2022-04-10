require('dotenv').config()

// Routes
const login = require('./routes/login')
const importRoute = require('./routes/import')
const materiasRoute = require('./routes/materias')
// Middlewares
const {validateJwt} = require('./middlewares/jwtValidation')

// App Config
const express = require('express')
const app = express()
app.use(express.json())

// VarEnvs
const PORT = process.env.PORT

app.use('/', login)
app.use('/import', importRoute)
app.use('/materias', materiasRoute)

app.get('/', validateJwt, async (req, res) => {
  const db = await pool.query('SELECT NOW()')

})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
