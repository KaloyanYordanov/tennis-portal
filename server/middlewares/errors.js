const { Logs } = require('../db');

module.exports = (err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    const result = {}
    err.errors.forEach(e => result[e.path] = e.message);
    res.status(422).send(result);
  }
  else if (err.name === 'DomainActionError') {
    res.status(422).send(err);
  }
  else Logs
    .create({
      ip: req.ip,
      path: req.path,
      method: req.method,
      body: JSON.stringify(req.body),
      params: JSON.stringify(req.params),
      query: JSON.stringify(req.query),
      error: JSON.stringify(err)
    })
    .then(() => res.status(500).end());
}