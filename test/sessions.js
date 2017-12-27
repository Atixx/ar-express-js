const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  sessionManager = require('./../app/services/sessionManager'),
  sessionService = require('./../app/services/sessions'),
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

describe('/users/sessions POST', () => {
  it('Should successful because user signin twice correctly', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      return successfulLogin().then(res2 => {
        res2.should.have.status(201);
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
    return successfulLogin()
      .then(res => {
        try {
          const decode = sessionManager.decode(res.headers.authorization);
          decode.should.be.equal('email1@wolox.com.ar');
        } catch (err) {
          err.should.be.an.instanceOf(Error);
        }
      })
      .then(() => done());
  });
  it('Should fail because of invalid token', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      delay(1000)
        .then(() => {
          try {
            sessionManager.decode(res.headers.authorization);
          } catch (err) {
            err.should.be.an.instanceOf(Error);
          }
        })
        .then(() => done());
    });
  });
});

describe('/users/logout POST', () => {
  it('Should successful because user logout correctly', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
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
      return sessionService.getCount(res.body.email).then(count => {
        count.should.to.equal(1);
        delay(1000).then(() => {
          return chai
            .request(server)
            .post('/users/logout')
            .send({ email: res.body.email })
            .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
            .catch(err => {
              err.response.should.have.status(401);
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
      delay(1000).then(() => {
        return successfulLogin().then(res2 => {
          res2.should.have.status(201);
          return sessionService.getCount(res2.body.email).then(count => {
            count.should.to.equal(2);
            return chai
              .request(server)
              .post('/users/logout/all')
              .send({ email: res.body.email })
              .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
              .catch(err => {
                err.response.should.have.status(401);
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
      delay(200).then(() => {
        return successfulLogin().then(res2 => {
          res2.should.have.status(201);
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
