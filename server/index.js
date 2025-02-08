import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const DB_NAME = 'auth_backend';
mongoose
  .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
  .then(() => {
    console.log('connected to backend');
  })
  .catch((err) => console.log(err));

const app = express();

app.listen(3000, () => {
  console.log('server is listening on port 3000');
});
