const express = require('express');
const {login, verify} = require('../controllers/loginController')

const router = express.Router();

router.post('/', login);
router.post('/validate', verify);

module.exports = router;