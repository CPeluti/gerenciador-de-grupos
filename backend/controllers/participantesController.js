const {DaoParticipantes} = require('../daos/daoParticipantes')
const dao = new DaoParticipantes()

const participantesCreate = async (req, res) => {
  const participantes = req.fields.participantes
  (participantes)
  let participantesCriados = []
  for (const element of participantes) {
    try {
      const participante = await dao.create(element)
      participantesCriados.push(participante)
    } catch (error) {
      console.log(error)
      res.status(500).json({message:"Erro ao criar participante", error: error})
      return
    }
  }
  participantesCriados = participantesCriados.filter(el=>el!==undefined)
  res.status(200).json({message:"Participantes criado com sucesso", participantes: participantesCriados})
}

const participantesFind = async (req, res) => {
  const params = req.query
  try{
    const participantes = await dao.findBy(params)
    res.status(200).json(participantes)
  } catch (error) {
    res.status(500).json({message:"Falha ao buscar registro", error: error})
  }
}

const participantesPatch = async (req, res) => {
  const dados = req.fields
  if(dados.length > 1) {
    res.status(500).json({message:"Somente um registro por vez"})
  }
  const filtro = {matricula: req.params.id}
  try{
    const participantes = await dao.update(filtro, dados)
    res.status(200).json(participantes)
  } catch (error) {
    res.status(500).json({message:"Falha ao atualizar registro", error: error})
  }
}

const participantesDelete = async (req, res) => {
  const id = req.params.id
  try{
    const participantes = await dao.delete(id)
    res.status(200).json({message:"Registro deletado com sucesso", participante: participantes})
  } catch (error){
    res.status(500).json({message:"Falha ao deletar registro", error: error})
  }
}

module.exports = {
  participantesCreate,
  participantesFind,
  participantesPatch,
  participantesDelete
}