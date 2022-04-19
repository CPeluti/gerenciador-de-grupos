const express = require('express')
const {gruposCreate, gruposFind, gruposPatch, gruposDelete, criaPedido, respondePedido} = require('../controllers/gruposController')

const router = express.Router();

router.post('/', gruposCreate);
router.get('/', gruposFind);
router.patch('/:id', gruposPatch);
router.delete('/:id', gruposDelete);	
router.post('/pedido', criaPedido);	
router.post('/pedido/:id', respondePedido);	

module.exports = router;