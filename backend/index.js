require('dotenv').config()
//Dao
const {DaoMaterias} = require('./daos/daoMaterias')
const daoMaterias = new DaoMaterias()
const {DaoTurmas} = require('./daos/daoTurmas')
const daoTurmas = new DaoTurmas()
const {DaoParticipantes} = require('./daos/daoParticipantes')
const daoParticipantes = new DaoParticipantes()
const {DaoUsuarios} = require('./daos/daoUsuarios')
const daoUsuarios = new DaoUsuarios()
const {DaoMensagens} = require('./daos/daoMensagens')
const daoMensagens = new DaoMensagens()
const {DaoGrupos} = require('./daos/daoGrupos')
const daoGrupos = new DaoGrupos()
const {DaoArquivos} = require('./daos/daoArquivos')
const daoArquivos = new DaoArquivos()
const {DaoInteresses} = require('./daos/daoInteresses')
const daoInteresses = new DaoInteresses()
const {DaoRelacionamentoTurmasParticipantes} = require('./daos/daoRelacionamentoTurmasParticipantes')
const daoRelacionamentoTurmasParticipantes = new DaoRelacionamentoTurmasParticipantes()
const {DaoRelacionamentoUsuariosGrupos} = require('./daos/daoRelacionamentoUsuariosGrupos')
const daoRelacionamentoUsuariosGrupos = new DaoRelacionamentoUsuariosGrupos()
const {DaoRelacionamentoGruposInteresses} = require('./daos/daoRelacionamentoGruposInteresses')
const daoRelacionamentoGruposInteresses = new DaoRelacionamentoGruposInteresses()
const {DaoPedidos} = require('./daos/daoPedidos')
const daoPedidos = new DaoPedidos()

// Routes
const login = require('./routes/login')
const importRoute = require('./routes/import')
const materiasRoute = require('./routes/materias')
const turmasRoute = require('./routes/turmas')
const gruposRoute = require('./routes/grupos')
const participantesRoute = require('./routes/participantes')
const usuariosRoute = require('./routes/usuarios')
const interessesRoute = require('./routes/interesses')
// Middlewares
const {validateJwt} = require('./middlewares/jwtValidation')

// App Config
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

// DB create tables
async function CreateTables(){
  await daoMaterias.createTable()
  await daoTurmas.createTable()
  await daoParticipantes.createTable()
  await daoUsuarios.createTable()
  await daoArquivos.createTable()
  await daoGrupos.createTable()
  await daoMensagens.createTable()
  await daoRelacionamentoTurmasParticipantes.createTable()
  await daoRelacionamentoUsuariosGrupos.createTable()
  await daoInteresses.createTable()
  await daoRelacionamentoGruposInteresses.createTable()
  await daoPedidos.createTable()
}

CreateTables()


// VarEnvs
const PORT = process.env.PORT

app.use('/login', login)
app.use('/import', importRoute)
app.use('/materias', materiasRoute)
app.use('/turmas', turmasRoute)
app.use('/grupos', gruposRoute)
app.use('/participantes', participantesRoute)
app.use('/usuarios', usuariosRoute)
app.use('/interesses', interessesRoute)


app.get('/', validateJwt, async (req, res) => {
  const db = await pool.query('SELECT NOW()')

})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
