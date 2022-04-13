require('dotenv').config()
//Dao
const {DaoMateria} = require('./dao/daoMaterias')
const daoMaterias = new DaoMateria()
const {DaoTurmas} = require('./dao/daoTurmas')
const daoTurmas = new DaoTurmas()
const {DaoParticipantes} = require('./dao/daoParticipantes')
const daoParticipantes = new DaoParticipantes()
const {DaoUsuarios} = require('./dao/DaoUsuarios')
const daoUsuarios = new DaoUsuarios()
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

// DB create tables

daoMaterias.createTable()
daoTurmas.createTable()
daoParticipantes.createTable()
daoUsuarios.createTable()

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
