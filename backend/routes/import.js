const express = require('express')
const {importController} = require('../controllers/scrapperController')

const router = express.Router();

router.get('/', importController);

module.exports = router;