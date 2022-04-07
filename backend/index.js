const express = require('express')
const app = express()
const PORT = process.env.PORT

app.get('/', (req, res) => {
  res.send('Olá')
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
