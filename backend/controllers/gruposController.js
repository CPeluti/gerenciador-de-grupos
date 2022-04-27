const {DaoGrupos} = require('../daos/daoGrupos')
const {DaoPedidos} = require('../daos/daoPedidos')
const {DaoRelacionamentoUsuariosGrupos} = require('../daos/daoRelacionamentoUsuariosGrupos')
const {DaoRelacionamentoGruposInteresses} = require('../daos/daoRelacionamentoGruposInteresses')
const {DaoUsuarios} = require('../daos/daoUsuarios')
const fs = require('fs')
const { DaoArquivos } = require('../daos/daoArquivos')

const dao = new DaoGrupos()
const daoUsuarios = new DaoUsuarios()
const daoPedidos = new DaoPedidos()
const daoRelacionamentoUsuariosGrupos = new DaoRelacionamentoUsuariosGrupos()
const daoRelacionamentoGruposInteresses = new DaoRelacionamentoGruposInteresses()
const daoArquivos = new DaoArquivos()

const gruposCreate = async (req, res) => {
  const {grupo, interesses} = req.fields
  try {
    const resultado = await dao.create(grupo)
    daoRelacionamentoUsuariosGrupos.create({id_usuario: grupo.criado_por, id_grupo: resultado.id})
    for(interesse of interesses){
      await daoRelacionamentoGruposInteresses.create({id_grupo: resultado.id, id_interesse: interesse})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Erro ao criar grupo", error: error})
    return
  }
  res.status(200).json({message:"Grupos criado com sucesso", grupos: grupo})
}

const gruposFind = async (req, res) => {
  const params = req.query
  try{
    const grupos = await dao.findBy(params)
    for (grupo of grupos) {
      let interesses = await daoRelacionamentoGruposInteresses.findInteresseBy({id_grupo: grupo.id_grupo}) 
      grupo.interesses = interesses
    }
    res.status(200).json(grupos)
  } catch (error) {
    res.status(500).json({message:"Falha ao buscar registro", error: error})
  }
}

const gruposPatch = async (req, res) => {
  const dados = req.fields
  if(dados.length > 1) {
    res.status(500).json({message:"Somente um registro por vez"})
  }
  const filtro = {id: req.params.id}
  try{
    const grupos = await dao.update(filtro, dados)
    res.status(200).json(grupos)
  } catch (error) {
    console.error(error)
    res.status(500).json({message:"Falha ao atualizar registro", error: error})
  }
}

const gruposDelete = async (req, res) => {
    const id = req.params.id
    try {
        await dao.update({id: id}, {ativo: false})
        // TODO: Adicionar logica para exibir avaliação
        res.status(200).send("Grupo finalizado com sucesso")
    } catch (e) {
        res.status(500).send({message: "Falha ao finalizar grupo", error: e})
        console.error(e)
    }
}

const gruposFindByParticipante = async (req, res) => {
  const matricula = req.params.id
  try {
    const grupos = await dao.findByParticipante(matricula)
    for (const grupo of grupos) {
      let interesses = await daoRelacionamentoGruposInteresses.findInteresseBy({id_grupo: grupo.id_grupo})
      grupo.interesses = interesses
    }
    res.status(200).json(grupos)
  } catch (e) {
    res.status(500).send({message: "Falha ao buscar grupos", error: e})
    console.error(e)
  }
}

const gruposFindAll = async (req, res) => {
  try {
    const grupos = await dao.findAll()
    for (grupo of grupos) {
      const interesses = await daoRelacionamentoGruposInteresses.findInteresseBy({id_grupo: grupo.id}) 
      grupo.interesses = interesses
      const usuarios = await daoRelacionamentoUsuariosGrupos.findUserByGrupo(grupo.id)
      grupo.usuarios = usuarios
    }
    res.status(200).json(grupos)
  } catch (e) {
    res.status(500).send({message: "Falha ao buscar grupos", error: e})
    console.error(e)
  }
}
const findPedidoByParticipante =  async (req, res) => {
  const matricula = req.params.id
  try {
    const pedidos = await daoPedidos.findByMatricula(matricula)
    res.status(200).json(pedidos)
  } catch (e){
    console.error(e)
    res.status(500).send({message: "Falha ao buscar pedidos", error: e})
  }
}
const findPedidoByGrupo =  async (req, res) => {
  const grupo = req.params.id
  try {
    const pedidos = await daoPedidos.findBy({id_grupo: grupo, aceito: null})
    res.status(200).json(pedidos)
  } catch (e){
    console.error(e)
    res.status(500).send({message: "Falha ao buscar pedidos", error: e})
  }
}
const criaPedido = async (req, res) => {
  // req.fields = {id_usuario, id_grupo}
  const {pedido} = req.fields
  try{
    await daoPedidos.create(pedido)
    res.status(200).send("Pedido criado com sucesso")
  }
  catch (e) {
    res.status(500).send({message: "Falha ao criar pedido", error: e})
    console.error(e)
  }
}

const respondePedido = async (req, res) => {
  // req.fields = {resposta: boolean}
  // req.params = {id: id_pedido}
  try{
    const pedido = await daoPedidos.update({id: req.params.id}, {aceito: req.fields.resposta})
    if(req.fields.resposta) {
      const id_usuario = pedido[0].id_usuario
      const id_grupo = pedido[0].id_grupo
      await daoRelacionamentoUsuariosGrupos.create({id_usuario, id_grupo})
      res.status(200).send("Pedido aceito com sucesso")
    } else {
      res.status(200).send("Pedido recusado com sucesso")
    }
  }
  catch (e) {
    res.status(500).send({message: "Falha ao criar pedido", error: e})
    console.error(e)
  }
}

const imgUpload = async (req, res) => {
  const {path, name, type} = req.files[Object.keys(req.files)]
  const arquivo = await fs.readFile(path, 'base64', async (err, img)=>{
    try {
      const resultado = await daoArquivos.create({arquivo: img, nome: name, tipo: type})
      res.status(201).send({message: "Arquivo enviado com sucesso", id: resultado.id})
    } catch (e) {
      console.log(e)
      res.status(500).send({message: "Falha ao enviar arquivo", error: e})
    }
  })
}
const imgDownload = async (req, res) => {
  try {
    let arquivo = await daoArquivos.findBy({id: req.params.id})
    arquivo = arquivo[0]
    const buffer = Buffer.from(arquivo.arquivo.toString('ascii'), 'base64')
    res.set('Content-Type', arquivo.tipo)
    res.set('Content-Length', buffer.length)
    res.status(200).send(buffer);
  } catch (e) {
    console.log(e)
    res.status(500).send({message: "Falha ao buscar arquivo", error: e})
  }
}

const finalizaGrupo = async (req, res) => {

}


module.exports = {
  gruposCreate,
  gruposFind,
  gruposPatch,
  gruposDelete,
  gruposFindAll,
  gruposFindByParticipante,
  findPedidoByParticipante,
  findPedidoByGrupo,
  criaPedido,
  respondePedido,
  imgUpload,
  imgDownload,
  finalizaGrupo
}