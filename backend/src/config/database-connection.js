const Sequelize = require("sequelize");

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDialect = process.env.DB_DIALECT;

const sequelizeConnection = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  port: 3306,
  dialect: dbDialect,
  timezone: "+00:00", // Force Sequelize to use UTC
  dialectOptions: {
    useUTC: true, // For reading from the database
    // dateStrings: true, // Return DATETIME as string, not JS Date (optional)
  },
});

module.exports = sequelizeConnection;
