const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/post', require('./post'));
router.use('/message', require('./message'));
router.use('/rating', require('./rating'));

module.exports = router;