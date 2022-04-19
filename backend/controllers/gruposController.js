const {DaoGrupos} = require('../daos/daoGrupos')
const {DaoPedidos} = require('../daos/daoPedidos')
const {DaoRelacionamentoUsuariosGrupos} = require('../daos/daoRelacionamentoUsuariosGrupos')
const {DaoRelacionamentoGruposInteresses} = require('../daos/daoRelacionamentoGruposInteresses')
const crypto = require("crypto-js")

const dao = new DaoGrupos()
const daoPedidos = new DaoPedidos()
const daoRelacionamentoUsuariosGrupos = new DaoRelacionamentoUsuariosGrupos()
const daoRelacionamentoGruposInteresses = new DaoRelacionamentoGruposInteresses()

const gruposCreate = async (req, res) => {
  const {grupo, interesses} = req.body
  console.log(grupo, interesses)
  try {
    const resultado = await dao.create(grupo)
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
    console.log(params)
    const grupos = await dao.findBy(params)
    res.status(200).json(grupos)
  } catch (error) {
    res.status(500).json({message:"Falha ao buscar registro", error: error})
  }
}

const gruposPatch = async (req, res) => {
  const dados = req.body
  if(dados.length > 1) {
    res.status(500).json({message:"Somente um registro por vez"})
  }
  const filtro = {id: req.params.id}
  console.log(filtro)
  try{
    const grupos = await dao.update(filtro, dados)
    res.status(200).json(grupos)
  } catch (error) {
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

const criaPedido = async (req, res) => {
    // req.body = {id_usuario, id_grupo}
    const {pedido} = req.body
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
    // req.body = {resposta: boolean}
    // req.params = {id: id_pedido}
    try{
        const pedido = await daoPedidos.update({id: req.params.id}, {aceito: req.body.resposta, recusado: !req.body.resposta})
        if(req.body.resposta) {
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



module.exports = {
  gruposCreate,
  gruposFind,
  gruposPatch,
  gruposDelete,
  criaPedido,
  respondePedido
}