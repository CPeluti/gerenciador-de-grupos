const jwt = require('jsonwebtoken')
const crypto = require("crypto-js")
const {DaoUsuarios} = require('../daos/daoUsuarios')
const {DaoTurmas} = require('../daos/daoTurmas')
const {DaoParticipantes} = require('../daos/daoParticipantes')
const { DaoRelacionamentoPermissoesUsuarios } = require('../daos/daoRelacionamentoPermissoesUsuarios')
const dao = new DaoUsuarios()
const daoTurmas = new DaoTurmas()
const daoParticipantes = new DaoParticipantes()
const daoRelacionamentoPermissoesUsuarios = new DaoRelacionamentoPermissoesUsuarios()
const login = async (req, res) => {
  const usuario = req.fields.usuario
  const senha = req.fields.senha
  try{
    const resultado = await dao.findBy({ usuario })
    const senhaDecryptBytes = crypto.AES.decrypt(resultado[0].senha, process.env.CRIPTSENHA);
    if (resultado.length === 1 && senhaDecryptBytes.toString(crypto.enc.Utf8) === senha.toString()) {
      const token = jwt.sign({
        usuario: usuario
      }, process.env.JWT_SECRET, { expiresIn: 3000})

      const minhasTurmas = await daoTurmas.findByParticipante({ id_usuario: resultado[0].matricula_participante })
      const participante = await daoParticipantes.findBy({ matricula: resultado[0].matricula_participante })
      const permissoes = await daoRelacionamentoPermissoesUsuarios.findBy({ id_usuario: resultado[0].id })
      res.json({
        auth: true,
        token: token,
        usuario: {
          id: resultado[0].id,
          matricula: resultado[0].matricula_participante,
          nome: resultado[0].nome,
          email: resultado[0].email,
          usuario: resultado[0].usuario,
          turmas: minhasTurmas,
          permissoes: permissoes.map(p => p.id_permissao),
        }
      })
      return
    }
    res.status(500).json({
      message: "login invalido"
    })
  } catch (e) {
    console.log(e)
    res.status(401).send({
      message: 'Usuário ou senha inválidos'
    })
    return
  }
  
}

const verify = async (req, res) => {
  const secret = process.env.JWT_SECRET
  
  if(!req.fields.token) {
    res.status(401).json({
      message: "Não autorizado"
    })
    return
  }  
  const token = req.fields.token
  jwt.verify(token, secret, (err, userInfo)=>{
    if(err) {
      res.status(401).json({
        message: 'Token expirado'
      })
      return
    }
    res.status(200).json({
      message: 'Autenticado'
    })
  })
}

module.exports = {
  login,
  verify
}