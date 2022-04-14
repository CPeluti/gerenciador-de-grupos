const express = require('express')
const {materiasCreate, materiasFind, materiasPatch, materiasDelete} = require('../controllers/materiasController')

const router = express.Router();

router.post('/', materiasCreate);
router.get('/', materiasFind);
router.patch('/:id', materiasPatch);
router.delete('/:id', materiasDelete);	

module.exports = router;