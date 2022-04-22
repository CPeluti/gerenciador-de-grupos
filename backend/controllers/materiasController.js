const {DaoMaterias} = require('../daos/daoMaterias')
const dao = new DaoMaterias()

const materiasCreate = async (req, res) => {
  const materias = req.fields.materias
  let materiasCriadas = []
  for (const element of materias) {
    try {
      const materia = await dao.create(element)
      materiasCriadas.push(materia)
    } catch (error) {
      res.status(500).json({message:"Erro ao criar materia", error: error})
      return
    }
  }
  materiasCriadas = materiasCriadas.filter(el=>el!==undefined)
  res.status(200).json({message:"Materias criada com sucesso", materias: materiasCriadas})
}

const materiasFind = async (req, res) => {
  const params = req.query
  try{
    const materias = await dao.findBy(params)
    res.status(200).json(materias)
  } catch (error) {
    res.status(500).json({message:"Falha ao buscar registro", error: error})
  }
}

const materiasPatch = async (req, res) => {
  const dados = req.fields
  if(dados.length > 1) {
    res.status(500).json({message:"Somente um registro por vez"})
  }
  const filtro = {codigo: req.params.id}
  try{
    const materias = await dao.update(filtro, dados)
    res.status(200).json(materias)
  } catch (error) {
    res.status(500).json({message:"Falha ao atualizar registro", error: error})
  }
}

const materiasDelete = async (req, res) => {
  const id = req.params.id
  try{
    const materias = await dao.delete(id)
    res.status(200).json({message:"Registro deletado com sucesso", materia: materias})
  } catch (error){
    res.status(500).json({message:"Falha ao deletar registro", error: error})
  }
}

module.exports = {
  materiasCreate,
  materiasFind,
  materiasPatch,
  materiasDelete
}