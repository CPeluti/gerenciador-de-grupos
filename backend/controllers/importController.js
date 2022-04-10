const Materia = require('../models/Materia')
const postgres = require('../dao/postgres')
const importController = async (req, res) => {
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

module.exports = {
  importController
}