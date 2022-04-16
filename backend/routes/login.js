const express = require('express')
const {login} = require('../controllers/loginController')
const {validateJwt} = require('../middlewares/jwtValidation')

const router = express.Router();

router.post('/', login);

module.exports = router;