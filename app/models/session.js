const Sequelize = require('sequelize');

exports.getModel = db => {
  return db.define(
    'sessions',
    {
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true
    }
  );
};
