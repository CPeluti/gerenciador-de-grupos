const express = require('express')
const {interessesCreate, interessesFind, interessesPatch, interessesDelete} = require('../controllers/interessesController')

const router = express.Router();

router.post('/', interessesCreate);
router.get('/', interessesFind);
router.patch('/:id', interessesPatch);
router.delete('/:id', interessesDelete);	

module.exports = router;