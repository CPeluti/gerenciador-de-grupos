const jwtService = require('jsonwebtoken')
const validateJwt = (req, res, next) => {
  const secret = process.env.JWT_SECRET
  
  if(!req.headers.authorization) {
    res.status(401).json({
      message: "Não autorizado"
    })
    return
  }  
  const jwt = req.headers.authorization.split(' ')[1]
  jwtService.verify(jwt, secret, (err, userInfo)=>{
    if(err) {
      res.status(401).json({
        message: 'Token inválido'
      })
      return
    }
    req.userInfo = userInfo
    next()
  })
}

module.exports = {
  validateJwt
}