const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

exports.index = (req, res, next) => {
  Message.find({}).exec((err, results) => {
    if (err) {
      return next(err);
    }
    res.render('index', { messages: results });
  });
};

exports.new_message_form_get = (req, res) => {
  if (!res.locals.currentUser) {
    res.redirect('/');
  }
  res.render('new-message-form');
};

exports.new_message_form_post = [
  body('title', 'Title is required').trim().isLength({ min: 1 }).escape(),
  body('text', 'Message text is required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      author:
        res.locals.currentUser.firstname +
        ' ' +
        res.locals.currentUser.lastname,
      timestamp: new Date().toLocaleString(),
      title: req.body.title,
      text: req.body.text,
    });

    if (!errors.isEmpty()) {
      res.render('new-message-form', {
        message: message,
        errors: errors.array(),
      });
      return;
    } else {
      message.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    }
  },
];

exports.delete_message_post = (req, res, next) => {
  Message.findByIdAndDelete(req.body.id).exec((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
