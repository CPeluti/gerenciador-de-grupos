const jwt = require('jsonwebtoken')
const crypto = require("crypto-js")
const {DaoUsuarios} = require('../daos/daoUsuarios')
const {DaoTurmas} = require('../daos/daoTurmas')
const {DaoParticipantes} = require('../daos/daoParticipantes')
const dao = new DaoUsuarios()
const daoTurmas = new DaoTurmas()
const daoParticipantes = new DaoParticipantes()
const login = async (req, res) => {
  console.log(req.body)
  const usuario = req.body.usuario
  const senha = req.body.senha
  try{
    const resultado = await dao.findBy({ usuario })
    const senhaDecryptBytes = crypto.AES.decrypt(resultado[0].senha, process.env.CRIPTSENHA);
    if (resultado.length === 1 && senhaDecryptBytes.toString(crypto.enc.Utf8) === senha.toString()) {
      const token = jwt.sign({
        usuario: usuario
      }, process.env.JWT_SECRET, { expiresIn: 3000})

      const minhasTurmas = await daoTurmas.findByParticipante({ id_usuario: resultado[0].matricula_participante })
      const participante = await daoParticipantes.findBy({ matricula: resultado[0].matricula_participante })
      console.log('teste',minhasTurmas, participante)

      res.json({
        auth: true,
        token: token,
        usuario: {
          id: resultado[0].id,
          matricula: resultado[0].matricula_participante,
          nome: resultado[0].nome,
          email: resultado[0].email,
          usuario: resultado[0].usuario,
          turmas: minhasTurmas
        }
      })
      return
    }
    console.log(resultado[0].senha, senha.toString())
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
  
  if(!req.body.token) {
    res.status(401).json({
      message: "Não autorizado"
    })
    return
  }  
  const token = req.body.token
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