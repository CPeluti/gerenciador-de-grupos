const axios = require('axios')
const {DaoMaterias} = require('../daos/daoMaterias')
const {DaoTurmas} = require('../daos/daoTurmas')
const {DaoParticipantes} = require('../daos/daoParticipantes')
const { DaoRelacionamentoTurmasParticipantes } = require('../daos/daoRelacionamentoTurmasParticipantes')

const daoTurmas = new DaoTurmas()
const daoMaterias = new DaoMaterias()
const daoParticipantes = new DaoParticipantes()
const daoRelacionamentoTurmasParticipantes = new DaoRelacionamentoTurmasParticipantes

const importController = async (req, res) => {
  try{
    console.log('Importando turmas do SIGAA')
    const {data} = await axios.post(`http://${process.env.SCRAPPER_HOST}:${process.env.SCRAPPER_PORT}/turmas`)
    for(result of data){
      const materia = {codigo: result.code, nome: result.name}
      const turma = {codigo: result.class.classCode, semestre: result.class.semester, horario: result.class.time, codigo_materia: result.code}
      console.log('Cadastrando matéria:', materia.nome)
      await daoMaterias.create(materia)
      console.log('Cadastrando Turma', turma.codigo)
      await daoTurmas.create(turma)
    }
    console.log('Turmas e Materias importadas com sucesso')
    const classes = data.map(item=>{
      return {classCode: item.class.classCode, code: item.code}
    })
    const participantesReq = await axios.post(`http://${process.env.SCRAPPER_HOST}:${process.env.SCRAPPER_PORT}/participantes`, {
      classes
    })
    console.log('Criando participantes')
    for(participantes of participantesReq.data){
      const turma = await daoTurmas.findBy({codigo: participantes.classCode, codigo_materia: participantes.code})
      for(dicente of participantes.dicente){
        await daoParticipantes.create(dicente)
        await daoRelacionamentoTurmasParticipantes.create({id_turma: turma[0].id, matricula_participante: dicente.matricula})
      }
      const docente = {matricula: participantes.docente.usuario, ...participantes.docente}
      await daoParticipantes.create(docente)
      await daoRelacionamentoTurmasParticipantes.create({id_turma: turma[0].id, matricula_participante: docente.matricula})
    }
    console.log('Participantes Criados')
  } catch (e) {
    console.error(e)
    res.send(new Error(e))
  }
}

module.exports = {
  importController
}