const express = require('express')
const {usuariosCreate, findAvalicoesPendentes, avaliar} = require('../controllers/usuariosController')

const router = express.Router();

router.post('/', usuariosCreate);
router.get('/avaliacoes/pendentes/:id', findAvalicoesPendentes);
router.post('/avaliar', avaliar);

module.exports = router;