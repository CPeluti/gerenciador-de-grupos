const express = require('express')
const {usuariosCreate} = require('../controllers/usuariosController')

const router = express.Router();

router.post('/', usuariosCreate);

module.exports = router;