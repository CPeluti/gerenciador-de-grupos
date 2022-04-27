const express = require('express')
const {participantesCreate, participantesFind, participantesPatch, participantesDelete} = require('../controllers/participantesController')

const router = express.Router();

router.post('/', participantesCreate);
router.get('/', participantesFind);
router.patch('/:id', participantesPatch);
router.delete('/:id', participantesDelete);	

module.exports = router;