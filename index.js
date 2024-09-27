import "dotenv/config";
import express from "express";
import cors from "cors";
import sequelize from "./db/connection.js";
import Card from "./models/Card.js";
import cardRouter from "./router/card.router.js"

const app = express();

const PORT = process.env.APP_PORT;

app.use(cors(), express.json(),express.urlencoded({ extended: true }));



app.use('/api/cards',cardRouter);

app.use('/Images',express.static('Images'));


const syncDatabase = async () => {
    try {
      await sequelize.sync({alter:true});
      console.log('tabel created successfully or got synced');
    } catch (error) {
      console.log("creating tabel got failed or it did not synced");
      console.log("error for creating tabel or syncing database:", error);
    }
  };
  
  syncDatabase()

app.listen(PORT, () => {
  console.log(`server is running on port:${PORT}`);
});
