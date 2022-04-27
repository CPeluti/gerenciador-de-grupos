const express = require('express')
const {gruposCreate, gruposFind, finalizaGrupo, gruposFindAll, gruposFindByParticipante, findPedidoByGrupo, findPedidoByParticipante, gruposPatch, criaPedido, respondePedido, imgUpload, imgDownload} = require('../controllers/gruposController')

const router = express.Router();

router.post('/', gruposCreate);
router.get('/', gruposFind);
router.get('/all', gruposFindAll);
router.patch('/:id', gruposPatch);
router.get('/participante/:id', gruposFindByParticipante);	
router.get('/pedido/enviados/:id', findPedidoByParticipante);	
router.get('/pedido/recebidos/:id', findPedidoByGrupo);	
router.post('/pedido', criaPedido);	
router.get('/pedido/enviados/:id', criaPedido);	
router.post('/pedido/:id', respondePedido);	
router.post('/upload', imgUpload);
router.get('/download/:id', imgDownload);
router.delete('/:id', finalizaGrupo);
module.exports = router;