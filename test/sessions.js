const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  sessionManager = require('./../app/services/sessionManager'),
  sessionService = require('./../app/services/sessions'),
  should = chai.should();

const successfulLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'email1@wolox.com.ar', password: '12345678' });
};

describe('sessions', () => {
  it('User signin twice and should be ok', done => {
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
  it('User signin and his token are valid', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      res.should.be.json;
      res.headers.should.have.property(sessionManager.HEADER_NAME);
      return sessionService
        .isValid(res.body.email, res.headers.authorize)
        .then(isValid => {
          isValid.should.have.property('dataValues');
        })
        .then(() => done());
    });
  });
  it('Should fail by invalid token', done => {
    return successfulLogin().then(res => {
      res.should.have.status(201);
      res.should.be.json;
      res.headers.should.have.property(sessionManager.HEADER_NAME);
      setTimeout(function() {
        return sessionService
          .isValid(res.body.email, res.headers.authorize)
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
          })
          .then(() => done());
      }, 1000);
    });
  });
});
