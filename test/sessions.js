const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  sessionManager = require('./../app/services/sessionManager'),
  sessionService = require('./../app/services/sessions'),
  should = chai.should(),
  delay = require('timeout-as-promise');

const successfulLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'email1@wolox.com.ar', password: '12345678' });
};

describe('/users/sessions POST', () => {
  it('Should successful because user signin twice correctly', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      res.should.be.json;
      res.headers.should.have.property(sessionManager.HEADER_NAME);
      return successfulLogin().then(res2 => {
        res2.should.have.status(201);
        res2.should.be.json;
        res2.headers.should.have.property(sessionManager.HEADER_NAME);
        return sessionService
          .getCount(res2.body.email)
          .then(count => {
            count.should.to.equal(2);
          })
          .then(() => done());
      });
    });
  });
  it('Should successful because user signin and his token are valid', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      res.should.be.json;
      res.headers.should.have.property(sessionManager.HEADER_NAME);
      return sessionService
        .isValid(res.body.email, res.headers.authorization)
        .then(isValid => {
          isValid.should.to.be.true;
        })
        .then(() => done());
    });
  });
  it('Should fail because of invalid token', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      res.should.be.json;
      res.headers.should.have.property(sessionManager.HEADER_NAME);
      delay(1000)
        .then(() => {
          return sessionService.isValid(res.body.email, res.headers.authorization).catch(err => {
            err.should.be.property('statusCode');
            err.statusCode.should.to.equal(400);
          });
        })
        .then(() => done());
    });
  });
});

describe('/users/logout POST', () => {
  it('Should successful because user logout correctly', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      res.should.be.json;
      res.headers.should.have.property(sessionManager.HEADER_NAME);
      return sessionService
        .getCount(res.body.email)
        .then(count => {
          count.should.to.equal(1);
        })
        .then(() => {
          return chai
            .request(server)
            .post('/users/logout')
            .send({ email: res.body.email })
            .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
            .then(res2 => {
              return sessionService.getCount(res.body.email).then(count2 => {
                count2.should.to.equal(0);
              });
            })
            .then(() => done());
        });
    });
  });
  it('Should fail because of invalid token', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      res.should.be.json;
      res.headers.should.have.property(sessionManager.HEADER_NAME);
      return sessionService.getCount(res.body.email).then(count => {
        count.should.to.equal(1);
        delay(1000).then(() => {
          return chai
            .request(server)
            .post('/users/logout')
            .send({ email: res.body.email })
            .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
            .catch(err => {
              return sessionService.getCount(res.body.email).then(count2 => {
                count2.should.to.equal(0);
              });
            })
            .then(() => done());
        });
      });
    });
  });
});

describe('/users/logout/all POST', () => {
  it('Should fail because of invalid token', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      res.should.be.json;
      res.headers.should.have.property(sessionManager.HEADER_NAME);
      delay(1000).then(() => {
        return successfulLogin().then(res2 => {
          res2.should.have.status(201);
          res2.should.be.json;
          res2.headers.should.have.property(sessionManager.HEADER_NAME);
          return sessionService.getCount(res2.body.email).then(count => {
            count.should.to.equal(2);
            return chai
              .request(server)
              .post('/users/logout/all')
              .send({ email: res.body.email })
              .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
              .catch(err => {
                return sessionService.getCount(res.body.email).then(count2 => {
                  count2.should.to.equal(1);
                });
              })
              .then(() => done());
          });
        });
      });
    });
  });
  it('Should successful because sessions database is empty', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      res.should.be.json;
      res.headers.should.have.property(sessionManager.HEADER_NAME);
      delay(200).then(() => {
        return successfulLogin().then(res2 => {
          res2.should.have.status(201);
          res2.should.be.json;
          res2.headers.should.have.property(sessionManager.HEADER_NAME);
          return sessionService.getCount(res2.body.email).then(count => {
            count.should.to.equal(2);
            return chai
              .request(server)
              .post('/users/logout/all')
              .send({ email: res.body.email })
              .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
              .then(res3 => {
                return sessionService.getCount(res.body.email).then(count2 => {
                  count2.should.to.equal(0);
                });
              })
              .then(() => done());
          });
        });
      });
    });
  });
});
