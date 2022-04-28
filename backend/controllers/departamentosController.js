const {DaoDepartamentos} = require('../daos/daoDepartamentos')
const dao = new DaoDepartamentos()

const departamentosCreate = async (req, res) => {
  console.log(req.fields)
  const departamentos = req.fields.departamentos
  let departamentosCriadas = []
  for (const element of departamentos) {
    try {
      const departamento = await dao.create(element)
      departamentosCriadas.push(departamento)
    } catch (error) {
      res.status(500).json({message:"Erro ao criar departamento", error: error})
      return
    }
  }
  departamentosCriadas = departamentosCriadas.filter(el=>el!==undefined)
  res.status(200).json({message:"Departamentos criada com sucesso", departamentos: departamentosCriadas})
}

const departamentosFind = async (req, res) => {
  const params = req.query
  try{
    const departamentos = await dao.findBy(params)
    res.status(200).json(departamentos)
  } catch (error) {
    res.status(500).json({message:"Falha ao buscar registro", error: error})
  }
}

const departamentosPatch = async (req, res) => {
  const dados = req.fields
  if(dados.length > 1) {
    res.status(500).json({message:"Somente um registro por vez"})
  }
  const filtro = {id: req.params.id}
  try{
    const departamentos = await dao.update(filtro, dados)
    res.status(200).json(departamentos)
  } catch (error) {
    res.status(500).json({message:"Falha ao atualizar registro", error: error})
  }
}

const departamentosDelete = async (req, res) => {
  const id = req.params.id
  try{
    const departamentos = await dao.delete(id)
    res.status(200).json({message:"Registro deletado com sucesso", departamento: departamentos})
  } catch (error){
    res.status(500).json({message:"Falha ao deletar registro", error: error})
  }
}

module.exports = {
  departamentosCreate,
  departamentosFind,
  departamentosPatch,
  departamentosDelete
}