const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  sessionManager = require('./../app/services/sessionManager'),
  should = chai.should();

describe('users test', () => {
  describe('/users/sessions POST', () => {
    it('should fail because of invalid email', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'invalid', password: '12345678' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          err.response.text.should.include('Invalid email or password');
        })
        .then(() => done());
    });
    it('should fail because of invalid password', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'email1@wolox.com.ar', password: '12345679' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          err.response.text.should.include('Invalid email or password');
        })
        .then(() => done());
    });
    it('Should be successful', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'email1@wolox.com.ar', password: '12345678' })
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property('firstname');
          res.body.should.have.property('lastname');
          res.body.should.have.property('email');
          res.body.should.have.property('password');
          res.headers.should.have.property(sessionManager.HEADER_NAME);
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail because email is missing', done => {
      return chai
        .request(server)
        .post('/users/sessions')
        .send({ password: '12345679' })
        .catch(err => {
          err.should.have.status(400);
          err.response.text.should.include('Missing parameters: email');
        })
        .then(() => done());
    });
    it('should fail because email and password is missing', done => {
      return chai
        .request(server)
        .post('/users/sessions')
        .catch(err => {
          err.should.have.status(400);
          err.response.text.should.include('Missing parameters: password email');
        })
        .then(() => done());
    });
  });
  describe('/users POST', () => {
    it('should be successful', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstname: 'Alan',
          lastname: 'Rinaldi',
          email: 'alan.rinaldi@wolox.com.ar',
          password: '12345678'
        })
        .then(res => {
          res.should.have.status(201);
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail because name is missing', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          lastname: 'Rinaldi',
          email: 'alan.rinaldi@wolox.com.ar',
          password: '12345678'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.text.should.include('Missing parameters: firstname');
        })
        .then(() => done());
    });
    it("should fail because password isn't alphanumeric", done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstname: 'Alan',
          lastname: 'Rinaldi',
          email: 'alan.rinaldi@wolox.com.ar',
          password: '123??56234'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('be alphanumeric');
        })
        .then(() => done());
    });
    it('should fail because password is short', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstname: 'Alan',
          lastname: 'Rinaldi',
          email: 'alan.rinaldi@wolox.com.ar',
          password: '1234'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('length > 8');
        })
        .then(() => done());
    });
    it('should fail because of invalid email 1', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstname: 'Alan',
          lastname: 'Rinaldi',
          email: 'alan.rinaldi',
          password: '12345678'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('@wolox.com.ar');
        })
        .then(() => done());
    });
    it('should fail because of invalid email 2', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstname: 'Alan',
          lastname: 'Rinaldi',
          email: '@wolox.com.ar',
          password: '12345678'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('@wolox.com.ar');
        })
        .then(() => done());
    });
    it('should fail because of invalid email 3', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstname: 'Alan',
          lastname: 'Rinaldi',
          email: '@wolox.com.ar.es',
          password: '12345678'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('@wolox.com.ar');
        })
        .then(() => done());
    });
    it("should fail because email isn't woloxmail", done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstname: 'Alan',
          lastname: 'Rinaldi',
          email: 'alan.rinaldi@gmail.com.ar',
          password: '12345678'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('@wolox.com.ar');
        })
        .then(() => done());
    });
    it('should fail because email must be unique', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstname: 'firstname1',
          lastname: 'lastname1',
          email: 'email1@wolox.com.ar',
          password: '12345678'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.text.should.include('email must be unique');
        })
        .then(() => done());
    });
  });
});
