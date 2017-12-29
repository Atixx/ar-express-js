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
          email: res.body.email,
          user_id: res.body.id,
          hits: 10
        })
        .then(res2 => {
          res2.should.have.status(201);
          dictum.chai(res2);
        })
        .then(() => done());
    });
  });
  it('should fail because user_id is missing', done => {
    return successfulLogin().then(res => {
      return chai
        .request(server)
        .post('/games/5/match')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .send({
          email: res.body.email,
          hits: 10
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('user_id cannot be null');
        })
        .then(() => done());
    });
  });
  it('Should fail because of invalid token', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      delay(1000).then(() => {
        return chai
          .request(server)
          .post('/games/5/match')
          .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
          .send({
            email: res.body.email,
            user_id: res.body.id,
            hits: 10
          })
          .catch(err => {
            err.response.should.have.status(401);
          })
          .then(() => done());
      });
    });
  });
});

describe('/games/:game_id/match GET', () => {
  it('Should be successful', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      return chai
        .request(server)
        .get('/games/1/match')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .then(res2 => {
          res2.should.have.status(200);
        })
        .then(() => done());
    });
  });
  it('Should fail because of invalid token', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      delay(1000).then(() => {
        return chai
          .request(server)
          .get('/games/1/match')
          .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            err.response.should.have.status(401);
          })
          .then(() => done());
      });
    });
  });
});
