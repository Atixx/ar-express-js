const bcrypt = require('bcrypt');

exports.execute = db => {
  return bcrypt
    .hash('1234', 10)
    .then(hash => {
      const data = [];
      data.push(
        db.models.user.create({
          firstName: 'firstName1',
          lastName: 'lastName1',
          email: 'email1@wolox.com.ar',
          password: hash
        })
      );
      data.push(
        db.models.user.create({
          firstName: 'firstName2',
          lastName: 'lastName2',
          username: 'username2',
          email: 'email2@wolox.com.ar',
          password: hash
        })
      );
      data.push(
        db.models.user.create({
          firstName: 'firstName3',
          lastName: 'lastName3',
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
