const User = require('../models/user');
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
        firstname:
          req.body.firstname.charAt(0).toUpperCase() +
          req.body.firstname.slice(1),
        lastname:
          req.body.lastname.charAt(0).toUpperCase() +
          req.body.lastname.slice(1),
        username: req.body.username,
        password: hashedPassword,
        isMember: false,
      });

      User.findOne({ username: user.username }).exec((err, results) => {
        if (err) {
          return next(err);
        }
        if (results !== null || !errors.isEmpty()) {
          user.password = req.body.password;
          res.render('sign-up-form', {
            user: user,
            errors:
              results == null
                ? errors.array()
                : [{ msg: 'Username already exists.' }],
          });
          return;
        } else {
          user.save((err) => {
            if (err) {
              return next(err);
            }
            const newUser = {
              id: user._id,
              username: user.username,
            };
            req.login(newUser, (err) => {
              if (err) {
                return next(err);
              }
              res.redirect('/');
            });
          });
        }
      });
    });
  },
];

exports.log_in_form_get = (req, res) => {
  res.render('log-in-form', { error: req.flash().error });
};

exports.log_in_form_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
  failureFlash: true,
});

exports.log_out_post = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

exports.member_join_form_get = (req, res) => {
  if (!res.locals.currentUser) {
    res.redirect('/');
  }
  res.render('member-join-form');
};

exports.member_join_form_post = (req, res, next) => {
  if (req.body.password !== process.env.MEMBERPASS) {
    res.render('member-join-form', {
      error: 'Incorrect password.',
    });
    return;
  } else {
    User.findOneAndUpdate(
      { username: res.locals.currentUser.username },
      { isMember: true },
      (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      }
    );
  }
};
