require('dotenv').config()
//Dao
const
  {DaoMaterias} = require('./daos/daoMaterias'),
  daoMaterias = new DaoMaterias(),
  {DaoTurmas} = require('./daos/daoTurmas'),
  daoTurmas = new DaoTurmas(),
  {DaoParticipantes} = require('./daos/daoParticipantes'),
  daoParticipantes = new DaoParticipantes(),
  {DaoUsuarios} = require('./daos/daoUsuarios'),
  daoUsuarios = new DaoUsuarios(),
  {DaoGrupos} = require('./daos/daoGrupos'),
  daoGrupos = new DaoGrupos(),
  {DaoArquivos} = require('./daos/daoArquivos'),
  daoArquivos = new DaoArquivos(),
  {DaoInteresses} = require('./daos/daoInteresses'),
  daoInteresses = new DaoInteresses(),
  {DaoRelacionamentoTurmasParticipantes} = require('./daos/daoRelacionamentoTurmasParticipantes'),
  daoRelacionamentoTurmasParticipantes = new DaoRelacionamentoTurmasParticipantes(),
  {DaoRelacionamentoUsuariosGrupos} = require('./daos/daoRelacionamentoUsuariosGrupos'),
  daoRelacionamentoUsuariosGrupos = new DaoRelacionamentoUsuariosGrupos(),
  {DaoRelacionamentoGruposInteresses} = require('./daos/daoRelacionamentoGruposInteresses'),
  daoRelacionamentoGruposInteresses = new DaoRelacionamentoGruposInteresses(),
  {DaoPedidos} = require('./daos/daoPedidos'),
  daoPedidos = new DaoPedidos(),
  {DaoDepartamentos} = require('./daos/daoDepartamentos'),
  daoDepartamentos = new DaoDepartamentos(),
  {DaoRelacionamentoPermissoesUsuarios} = require('./daos/daoRelacionamentoPermissoesUsuarios'),
  daoRelacionamentoPermissoesUsuarios = new DaoRelacionamentoPermissoesUsuarios(),
  {DaoPermissoes} = require('./daos/daoPermissoes'),
  daoPermissoes = new DaoPermissoes(),
  {DaoAvaliacoes} = require('./daos/daoAvaliacoes'),
  daoAvaliacoes = new DaoAvaliacoes(),
  {DaoAvaliacoesPendentes} = require('./daos/daoAvaliacoesPendentes'),
  daoAvaliacoesPendentes = new DaoAvaliacoesPendentes()

// Routes
const
  login = require('./routes/login'),
  importRoute = require('./routes/import'),
  materiasRoute = require('./routes/materias'),
  turmasRoute = require('./routes/turmas'),
  gruposRoute = require('./routes/grupos'),
  participantesRoute = require('./routes/participantes'),
  usuariosRoute = require('./routes/usuarios'),
  interessesRoute = require('./routes/interesses'),
  departamentosRoute = require('./routes/departamentos')
// Middlewares
const {validateJwt} = require('./middlewares/jwtValidation')

// App Config
const
  express = require('express'),
  cors = require('cors'),
  throttle = require('express-throttle-bandwidth'),
  formidableMiddleware = require('express-formidable'),
  app = express()

app.use(cors())
// app.use(express.json())
// app.use(throttle(1024*128))
app.use(formidableMiddleware())

// DB create tables
async function CreateTables(){
  await daoDepartamentos.createTable()
  await daoMaterias.createTable()
  await daoTurmas.createTable()
  await daoParticipantes.createTable()
  await daoUsuarios.createTable()
  await daoArquivos.createTable()
  await daoGrupos.createTable()
  await daoRelacionamentoTurmasParticipantes.createTable()
  await daoRelacionamentoUsuariosGrupos.createTable()
  await daoInteresses.createTable()
  await daoRelacionamentoGruposInteresses.createTable()
  await daoPedidos.createTable()
  await daoPermissoes.createTable()
  await daoRelacionamentoPermissoesUsuarios.createTable()
  await daoAvaliacoes.createTable()
  await daoAvaliacoesPendentes.createTable()
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
app.use('/departamentos', departamentosRoute)


app.get('/', validateJwt, async (req, res) => {
  const db = await pool.query('SELECT NOW()')

})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
