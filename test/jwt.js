const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  sessionManager = require('./../app/services/sessionManager'),
  should = chai.should();

describe('encode and decode by jwt', () => {
  it('should be successful because encode and decode a word', done => {
    const enc = sessionManager.encode({ name: 'Alan' });
    const dec = sessionManager.decode(enc);
    dec.should.be.property('name');
    dec.name.should.be.equal('Alan');
    done();
  });
  it('should fail because of invalid token', done => {
    const token = sessionManager.encode({ name: 'Alan' }, 0.5);
    setTimeout(() => {
      try {
        const dec = sessionManager.decode(token);
      } catch (err) {
        err.should.be.an.instanceOf(Error);
        done();
      }
    }, 1000);
  });
});
