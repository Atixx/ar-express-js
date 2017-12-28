const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  sessionManager = require('./../app/services/sessionManager'),
  orm = require('./../app/orm'),
  errors = require('./../app/errors'),
  should = chai.should();

const successfulLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'email1@wolox.com.ar', password: '12345678' });
};

const delay = time => {
  return new Promise(function(fulfill, reject) {
    setTimeout(function() {
      fulfill();
    }, time);
  });
};

describe('Regular users test', () => {
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

describe('Admin test', () => {
  describe('/admin/users POST', () => {
    it('Should be successful because create a new admin user', done => {
      return successfulLogin().then(res => {
        return chai
          .request(server)
          .post('/admin/users')
          .send({
            email: 'email1@wolox.com.ar',
            admin: {
              firstname: 'Alan',
              lastname: 'Rinaldi',
              email: 'alan.rinaldi@wolox.com.ar',
              password: '12345678'
            }
          })
          .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
          .then(res2 => {
            res2.should.have.status(201);
            dictum.chai(res2);
          })
          .then(() => done());
      });
    });
    it('Should be successful because update a user to admin', done => {
      return successfulLogin().then(res => {
        return chai
          .request(server)
          .post('/admin/users')
          .send({
            email: 'email1@wolox.com.ar',
            admin: {
              firstname: 'Alan',
              lastname: 'Rinaldi',
              email: 'email2@wolox.com.ar',
              password: '12345678'
            }
          })
          .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
          .then(res2 => {
            res2.should.have.status(200);
            dictum.chai(res2);
            return orm.models.user
              .findOne({ where: { email: 'email2@wolox.com.ar' } })
              .then(u => u.dataValues.admin.should.be.equal(true))
              .catch(err => {
                throw errors.databaseError(err.detail);
              });
          })
          .then(() => done());
      });
    });
    it('Should fail because of invalid token', done => {
      return successfulLogin().then(res => {
        return chai
          .request(server)
          .post('/admin/users')
          .send({
            email: 'email1@wolox.com.ar',
            admin: {
              firstname: 'Alan',
              lastname: 'Rinaldi',
              email: 'email2@wolox.com.ar',
              password: '12345678'
            }
          })
          .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            err.response.should.have.status(401);
          })
          .then(() => done());
      });
    });
    it('Should fail because of permission denied', done => {
      return successfulLogin().then(res => {
        return chai
          .request(server)
          .post('/admin/users')
          .send({
            email: 'email2@wolox.com.ar',
            admin: {
              firstname: 'Alan',
              lastname: 'Rinaldi',
              email: 'email2@wolox.com.ar',
              password: '12345678'
            }
          })
          .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            err.response.should.have.status(401);
          })
          .then(() => done());
      });
    });
  });
});

describe('Users list test', () => {
  describe('/users GET', () => {
    it('Should be successful', done => {
      return successfulLogin().then(res => {
        res.should.have.status(201);
        return chai
          .request(server)
          .get('/users')
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
            .get('/users')
            .set(sessionManager.HEADER_NAME, res.headers[sessionManager.HEADER_NAME])
            .catch(err => {
              err.response.should.have.status(401);
            })
            .then(() => done());
        });
      });
    });
  });
});
