const jwt = require('jsonwebtoken')
const login = (req, res) => {
  const username = req.body.username
  const password = req.body.password
  console.log('passou', password)

  if (username == 'caio' && password == '2134') {
    const token = jwt.sign({
      username: username
    }, process.env.JWT_SECRET, { expiresIn: 3000})

    res.json({
      auth: true,
      token: token
    })
    return
  }
  res.status(500).json({
    message: "login invalido"
  })
}

module.exports = {
  login
}