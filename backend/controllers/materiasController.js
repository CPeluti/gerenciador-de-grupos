const Materia = require('../models/Materia')
const postgres = require('../dao/postgres')

const materiasCreate = async (req, res) => {
  const materias = req.body.materias
  let materiasCriadas = []
  for (const element of materias) {
    const model = new Materia(postgres, element)
    try {
      const materia = await model.create()
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
  const model = new Materia(postgres)
  try{
    const materias = await model.findBy(params)
    res.status(200).json(materias)
  } catch (error) {
    res.status(500).json({message:"Falha ao buscar registro", error: error})
  }
}

const materiasPatch = async (req, res) => {
  const dados = req.body
  if(dados.length > 1) {
    res.status(500).json({message:"Somente um registro por vez"})
  }
  const filtro = {codigo: req.params.id}
  const model = new Materia(postgres)
  try{
    const materias = await model.update(filtro, dados)
    res.status(200).json(materias)
  } catch (error) {
    res.status(500).json({message:"Falha ao atualizar registro", error: error})
  }
}

const materiasDelete = async (req, res) => {
  const id = req.params.id
  const model = new Materia(postgres)
  try{
    const materias = await model.delete(id)
    res.status(200).json({message:"Registro deletado com sucesso"})
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