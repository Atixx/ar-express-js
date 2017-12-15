const chai = require('chai'),
  server = require('./../app'),
  sessionManager = require('./../app/services/sessionManager'),
  should = chai.should();

describe('users', () => {
  describe('users sessions', () => {
    it('should fail because of invalid email', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'invalid', password: '1234' })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
        })
        .then(() => done());
    });
  });
});
