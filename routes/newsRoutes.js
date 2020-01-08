const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/', newsController.getAllNews);

router.post('/', [auth, admin], newsController.postAddNews);

router.put('/:id', [auth, admin], newsController.updateNews);

router.delete('/:id', [auth, admin], newsController.deleteNews);


module.exports = router;