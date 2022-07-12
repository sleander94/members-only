const User = require('../models/user');
const Message = require('../models/message');
const async = require('async');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.sign_up_form_get = (req, res) => {
  res.render('sign-up-form');
};

exports.sign_up_form_post = [
  body('firstname', 'Firstname is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastname', 'Lastname is required').trim().isLength({ min: 1 }).escape(),
  body('name', 'Username must be between 8 and 16 characters')
    .trim()
    .isLength({ max: 16 })
    .escape(),
  body('password', 'Password must be 5 or more characters')
    .isLength({
      min: 5,
    })
    .escape(),
  body('confirm-password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),

  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      const errors = validationResult(req);

      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: hashedPassword,
        isMember: false,
      });

      if (!errors.isEmpty()) {
        user.password = req.body.password;
        res.render('sign-up-form', {
          user: user,
          errors: errors.array(),
        });
        return;
      } else {
        user.save(function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });
      }
    });
  },
];

exports.log_in_form_get = (req, res) => {
  res.render('log-in-form');
};

exports.log_in_form_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
  failureMessage: true,
});
