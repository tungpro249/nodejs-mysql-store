import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('testdb', 'root', 'tungpro249', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
});

sequelize.authenticate()
  .then(() => {
    console.log('Sequelize connection established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database with Sequelize:', error);
  });

export default sequelize;
