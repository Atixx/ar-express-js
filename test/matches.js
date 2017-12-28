const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  sessionManager = require('./../app/services/sessionManager'),
  orm = require('./../app/orm'),
  errors = require('./../app/errors'),
  should = chai.should();

const delay = time => {
  return new Promise(function(fulfill, reject) {
    setTimeout(function() {
      fulfill();
    }, time);
  });
};

const successfulLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'email1@wolox.com.ar', password: '12345678' });
};

describe('/games/:game_id/match POST', () => {
  it('should be successful', done => {
    return successfulLogin().then(res => {
      return chai
        .request(server)
        .post('/games/5/match')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .send({
          email: 'email1@wolox.com.ar',
          match: {
            user_id: 1,
            hits: 10
          }
        })
        .then(res2 => {
          res2.should.have.status(201);
          dictum.chai(res2);
        })
        .then(() => done());
    });
  });
});
