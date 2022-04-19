const {DaoInteresses} = require('../daos/daoInteresses')
const dao = new DaoInteresses()

const interessesCreate = async (req, res) => {
  const interesses = req.body.interesses
  let interessesCriadas = []
  for (const element of interesses) {
    try {
      const interesse = await dao.create(element)
      interessesCriadas.push(interesse)
    } catch (error) {
      res.status(500).json({message:"Erro ao criar interesse", error: error})
      return
    }
  }
  interessesCriadas = interessesCriadas.filter(el=>el!==undefined)
  res.status(200).json({message:"Interesses criada com sucesso", interesses: interessesCriadas})
}

const interessesFind = async (req, res) => {
  const params = req.query
  try{
    console.log(params)
    const interesses = await dao.findBy(params)
    res.status(200).json(interesses)
  } catch (error) {
    res.status(500).json({message:"Falha ao buscar registro", error: error})
  }
}

const interessesPatch = async (req, res) => {
  const dados = req.body
  if(dados.length > 1) {
    res.status(500).json({message:"Somente um registro por vez"})
  }
  const filtro = {codigo: req.params.id}
  try{
    const interesses = await dao.update(filtro, dados)
    res.status(200).json(interesses)
  } catch (error) {
    res.status(500).json({message:"Falha ao atualizar registro", error: error})
  }
}

const interessesDelete = async (req, res) => {
  const id = req.params.id
  try{
    const interesses = await dao.delete(id)
    res.status(200).json({message:"Registro deletado com sucesso", interesse: interesses})
  } catch (error){
    res.status(500).json({message:"Falha ao deletar registro", error: error})
  }
}

module.exports = {
  interessesCreate,
  interessesFind,
  interessesPatch,
  interessesDelete
}