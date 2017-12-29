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

describe('/games POST', () => {
  it('should be successful', done => {
    return successfulLogin().then(res => {
      return chai
        .request(server)
        .post('/games')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .send({
          email: 'email1@wolox.com.ar',
          game: {
            name: 'game2',
            code: 'code2',
            score: 10
          }
        })
        .then(res2 => {
          res2.should.have.status(201);
          dictum.chai(res2);
        })
        .then(() => done());
    });
  });
  it('should fail because name is missing', done => {
    return successfulLogin().then(res => {
      return chai
        .request(server)
        .post('/games')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .send({
          email: 'email1@wolox.com.ar',
          game: {
            code: 'code2',
            score: 10
          }
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('name cannot be null');
        })
        .then(() => done());
    });
  });
  it('should fail because code must be unique', done => {
    return successfulLogin().then(res => {
      return chai
        .request(server)
        .post('/games')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .send({
          email: 'email1@wolox.com.ar',
          game: {
            name: 'game2',
            code: 'code1',
            score: 10
          }
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('code must be unique');
        })
        .then(() => done());
    });
  });
  it('Should fail because of invalid token', done => {
    return successfulLogin().then(res => {
      delay(1000).then(() => {
        return chai
          .request(server)
          .post('/games')
          .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
          .send({
            email: 'email1@wolox.com.ar',
            game: {
              name: 'game2',
              code: 'code1',
              score: 10
            }
          })
          .catch(err => {
            err.should.have.status(401);
          })
          .then(() => done());
      });
    });
  });
});

describe('/games GET', () => {
  it('Should be successful', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      return chai
        .request(server)
        .get('/games')
        .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
        .then(res2 => {
          res2.should.have.status(200);
        })
        .then(() => done());
    });
  });
  it('Should fail because invalid token', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      delay(1000).then(() => {
        return chai
          .request(server)
          .get('/games')
          .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            err.response.should.have.status(401);
          })
          .then(() => done());
      });
    });
  });
});
