const bcrypt = require('bcrypt');

exports.execute = db => {
  return bcrypt
    .hash('12345678', 10)
    .then(hash => {
      const data = [];
      data.push(
        db.models.user.create({
          firstname: 'firstname1',
          lastname: 'lastName1',
          email: 'email1@wolox.com.ar',
          password: hash
        })
      );
      data.push(
        db.models.user.create({
          firstname: 'firstName2',
          lastname: 'lastName2',
          username: 'username2',
          email: 'email2@wolox.com.ar',
          password: hash
        })
      );
      data.push(
        db.models.user.create({
          firstname: 'firstName3',
          lastname: 'lastName3',
          username: 'username3',
          email: 'email3@wolox.com.ar',
          password: hash
        })
      );
      return Promise.all(data);
    })
    .catch(bcryptErr => {
      throw bcryptErr;
    });
};
