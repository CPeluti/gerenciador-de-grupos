const {DaoUsuarios} = require('../daos/daoUsuarios')
const crypto = require("crypto-js")

const dao = new DaoUsuarios()

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


module.exports = {
  usuariosCreate,
  usuariosFind,
  usuariosPatch  
}