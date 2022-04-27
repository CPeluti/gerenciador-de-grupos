const {DaoUsuarios} = require('../daos/daoUsuarios')
const crypto = require("crypto-js")
const { DaoAvaliacoesPendentes } = require('../daos/daoAvaliacoesPendentes')
const { DaoAvaliacoes } = require('../daos/daoAvaliacoes')
const req = require('express/lib/request')

const dao = new DaoUsuarios()
const daoAvaliacoes = new DaoAvaliacoes()
const daoAvaliacoesPendentes = new DaoAvaliacoesPendentes()

const usuariosCreate = async (req, res) => {
  var cipherPassword = crypto.AES.encrypt(req.fields.senha, process.env.CRIPTSENHA)
  const matricula = req.fields.matricula
  const usuario = {
    usuario: matricula,
    senha: cipherPassword.toString(),
    matricula_participante: matricula
  }
  try {
    await dao.create(usuario)
  } catch (error) {
    res.status(500).json({message:"Erro ao criar usuario", error: error})
    return
  }
  res.status(200).json({message:"Usuarios criado com sucesso", usuarios: usuario})
}

const usuariosFind = async (req, res) => {
  const params = req.query
  try{
    const usuarios = await dao.findBy(params)
    res.status(200).json(usuarios)
  } catch (error) {
    res.status(500).json({message:"Falha ao buscar registro", error: error})
  }
}

const usuariosPatch = async (req, res) => {
  const dados = req.fields
  if(dados.length > 1) {
    res.status(500).json({message:"Somente um registro por vez"})
  }
  const filtro = {id: req.params.id}
  try{
    const usuarios = await dao.update(filtro, dados)
    res.status(200).json(usuarios)
  } catch (error) {
    res.status(500).json({message:"Falha ao atualizar registro", error: error})
  }
}

const findAvalicoesPendentes = async (req, res)=>{
  const id_avaliador = req.params.id
  try {
    const resultado = await daoAvaliacoesPendentes.findBy({id_avaliador, pendente: 1})
    res.status(200).send(resultado)
  } catch (e) {
    res.status(500).send("Erro ao buscar avaliações pendentes")
  }
}

const avaliar = async ( req, res ) => {
  const avaliacao = req.fields
  console.log(avaliacao)
  const resultado = await daoAvaliacoesPendentes.update({id: avaliacao.id}, {pendente: 0})
  try {
    await daoAvaliacoes.create(avaliacao)
    res.status(201).send("Avaliação realizada com sucesso")
  } catch (e) {
    res.status(500).send("Erro ao avaliar")
  }
}

module.exports = {
  usuariosCreate,
  usuariosFind,
  usuariosPatch,
  findAvalicoesPendentes,
  avaliar
}