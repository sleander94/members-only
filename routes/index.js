var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController');

router.get('/', function (req, res) {
  res.render('index');
});
router.get('/sign-up', user_controller.sign_up_form_get);
router.post('/sign-up', user_controller.sign_up_form_post);
router.get('/log-in', user_controller.log_in_form_get);
router.post('/log-in', user_controller.log_in_form_post);
router.post('/log-out', user_controller.log_out_post);
router.get('/join', user_controller.member_join_form_get);
router.post('/join', user_controller.member_join_form_post);

module.exports = router;
