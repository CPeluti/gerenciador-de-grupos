const {DaoMateria} = require('../dao/daoMaterias.js')
const dao = new DaoMateria()
const importController = async (req, res) => {
  const materias = req.body.materias
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

module.exports = {
  importController
}