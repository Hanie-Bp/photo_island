import { Sequelize } from "sequelize";

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

const sequelize = new Sequelize({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  username: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  dialect: "mysql",
  logging: false,
});

const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("connected to database successfully");
  } catch (error) {
    console.log("connection failed");
    console.log(`error for checking database connection:`, error);
  }
};

checkConnection();

export default sequelize;
