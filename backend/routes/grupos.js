const express = require('express')
const {gruposCreate, gruposFind, gruposFindAll, gruposFindByParticipante, findPedidoByGrupo, findPedidoByParticipante, gruposPatch, gruposDelete, criaPedido, respondePedido, imgUpload, imgDownload} = require('../controllers/gruposController')

const router = express.Router();

router.post('/', gruposCreate);
router.get('/', gruposFind);
router.get('/all', gruposFindAll);
router.patch('/:id', gruposPatch);
router.delete('/:id', gruposDelete);
router.get('/participante/:id', gruposFindByParticipante);	
router.get('/pedido/enviados/:id', findPedidoByParticipante);	
router.get('/pedido/recebidos/:id', findPedidoByGrupo);	
router.post('/pedido', criaPedido);	
router.get('/pedido/enviados/:id', criaPedido);	
router.post('/pedido/:id', respondePedido);	
router.post('/upload', imgUpload);
router.get('/download/:id', imgDownload);
module.exports = router;