require('dotenv').config()
//Dao
const {DaoMateria} = require('./dao/daoMaterias')
const daoMaterias = new DaoMateria()
const {DaoTurmas} = require('./dao/daoTurmas')
const daoTurmas = new DaoTurmas()
const {DaoParticipantes} = require('./dao/daoParticipantes')
const daoParticipantes = new DaoParticipantes()
const {DaoUsuarios} = require('./dao/daoUsuarios')
const daoUsuarios = new DaoUsuarios()
const {DaoMensagens} = require('./dao/daoMensagens')
const daoMensagens = new DaoMensagens()
const {DaoGrupos} = require('./dao/daoGrupos')
const daoGrupos = new DaoGrupos()
const {DaoRelacionamentoTurmasParticipantes} = require('./dao/daoRelacionamentoTurmasParticipantes')
const daoRelacionamentoTurmasParticipantes = new DaoRelacionamentoTurmasParticipantes()
const {DaoRelacionamentoUsuariosGrupos} = require('./dao/daoRelacionamentoUsuariosGrupos')
const daoRelacionamentoUsuariosGrupos = new DaoRelacionamentoTurmasParticipantes()
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
daoMensagens.createTable()
daoGrupos.createTable()
daoRelacionamentoTurmasParticipantes.createTable()
daoRelacionamentoUsuariosGrupos.createTable()

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
