var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController');
const message_controller = require('../controllers/messageController');

router.get('/sign-up', user_controller.sign_up_form_get);
router.post('/sign-up', user_controller.sign_up_form_post);
router.get('/log-in', user_controller.log_in_form_get);
router.post('/log-in', user_controller.log_in_form_post);
router.post('/log-out', user_controller.log_out_post);
router.get('/join', user_controller.member_join_form_get);
router.post('/join', user_controller.member_join_form_post);

router.get('/', message_controller.index);
router.get('/new-message', message_controller.new_message_form_get);
router.post('/new-message', message_controller.new_message_form_post);
router.post('/delete-message', message_controller.delete_message_post);

module.exports = router;
