const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  sessionManager = require('./../app/services/sessionManager'),
  should = chai.should();

describe('users test', () => {
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
          err.response.should.be.json;
          err.response.text.should.include('firstname cannot be null');
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
