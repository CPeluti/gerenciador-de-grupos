const express = require('express')
const {turmasCreate, turmasFind, turmasPatch, turmasDelete} = require('../controllers/turmasController')

const router = express.Router();

router.post('/', turmasCreate);
router.get('/', turmasFind);
router.patch('/:id', turmasPatch);
router.delete('/:id', turmasDelete);	

module.exports = router;