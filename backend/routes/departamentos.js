const express = require('express')
const {departamentosCreate, departamentosFind, departamentosPatch, departamentosDelete} = require('../controllers/departamentosController')

const router = express.Router();

router.post('/', departamentosCreate);
router.get('/', departamentosFind);
router.patch('/:id', departamentosPatch);
router.delete('/:id', departamentosDelete);	

module.exports = router;