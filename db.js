const Sequelize = require('sequelize');

const dbUsername = process.env.DB_USERNAME;
const dbpassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
let dbHost = process.env.DB_HOST;

if(!dbHost) {
    dbHost = 'localhost';
}

                                //database username   password
const sequelize = new Sequelize(dbName, dbUsername, dbpassword, {
    host: dbHost,
    dialect: 'postgres'
})

sequelize.authenticate().then(
    function success() {
        console.log("Connected to DB");
    },

    function fail(err) {
        console.log(`Error: ${err}`);
    }
)

module.exports = sequelize;