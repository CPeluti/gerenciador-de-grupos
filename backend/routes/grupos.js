const express = require('express')
const {gruposCreate, gruposFind, gruposFindByParticipante, gruposPatch, gruposDelete, criaPedido, respondePedido, imgUpload, imgDownload} = require('../controllers/gruposController')

const router = express.Router();

router.post('/', gruposCreate);
router.get('/', gruposFind);
router.patch('/:id', gruposPatch);
router.delete('/:id', gruposDelete);
router.get('/participante/:id', gruposFindByParticipante);	
router.post('/pedido', criaPedido);	
router.post('/pedido/:id', respondePedido);	
router.post('/upload', imgUpload);
router.get('/download/:id', imgDownload);
module.exports = router;