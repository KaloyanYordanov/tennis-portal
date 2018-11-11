const router = require('express').Router();
const auth = require('../infrastructure/middlewares/auth');
const UserService = require('./user.service');
const EmailService = require('../emails/email.service');

const getAll = (req, res, next) => {
  return UserService
    .getAll()
    .then(e => res.json(e));
}

const create = async (req, res, next) => {
  try {
    const user = await UserService.create(req.body);
    await EmailService.createRegistrationEmail(user);
    return res.json(user);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const update = (req, res, next) => {
  return UserService
    .update(req.params.id, req.body)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const remove = (req, res, next) => {
  return UserService
    .delete(req.params.id)
    .then(_ => res.json({}))
    .catch(err => next(err, req, res, null));
}

const activate = async (req, res, next) => {
  try {
    await UserService.activateUser(req.query.token);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.get('/activation', activate);
router.get('/', auth, getAll);
router.post('/:id', update);
router.post('/', create);
router.delete('/:id', auth, remove);

module.exports = router;