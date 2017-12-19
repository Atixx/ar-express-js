const chai = require('chai'),
  server = require('./../app'),
  dictum = require('dictum.js'),
  sessionManager = require('./../app/services/sessionManager'),
  should = chai.should();

describe('encode and decode by jwt', () => {
  it('encode and decode a word', done => {
    const enc = sessionManager.encode({ name: 'Alan' });
    const dec = sessionManager.decode(enc);
    dec.should.be.property('name');
    dec.name.should.be.equal('Alan');
    done();
  });
});
