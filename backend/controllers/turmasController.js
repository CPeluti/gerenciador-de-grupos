const {DaoTurmas} = require('../daos/daoTurmas')
const dao = new DaoTurmas()

const turmasCreate = async (req, res) => {
  const turmas = req.fields.turmas
  let turmasCriadas = []
  for (const element of turmas) {
    try {
      const turma = await dao.create(element)
      turmasCriadas.push(turma)
    } catch (error) {
      res.status(500).json({message:"Erro ao criar turma", error: error})
      return
    }
  }
  turmasCriadas = turmasCriadas.filter(el=>el!==undefined)
  res.status(200).json({message:"Turmas criada com sucesso", turmas: turmasCriadas})
}

const turmasFind = async (req, res) => {
  const params = req.query
  try{
    const turmas = await dao.findBy(params)
    res.status(200).json(turmas)
  } catch (error) {
    res.status(500).json({message:"Falha ao buscar registro", error: error})
  }
}

const turmasPatch = async (req, res) => {
  const dados = req.fields
  if(dados.length > 1) {
    res.status(500).json({message:"Somente um registro por vez"})
  }
  const filtro = {id: req.params.id}
  try{
    const turmas = await dao.update(filtro, dados)
    res.status(200).json(turmas)
  } catch (error) {
    res.status(500).json({message:"Falha ao atualizar registro", error: error})
  }
}

const turmasDelete = async (req, res) => {
  const id = req.params.id
  try{
    const turmas = await dao.delete(id)
    res.status(200).json({message:"Registro deletado com sucesso", turma: turmas})
  } catch (error){
    res.status(500).json({message:"Falha ao deletar registro", error: error})
  }
}

module.exports = {
  turmasCreate,
  turmasFind,
  turmasPatch,
  turmasDelete
}