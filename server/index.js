import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from "path"

dotenv.config();
const DB_NAME = 'auth_backend';
mongoose
  .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
  .then(() => {
    console.log('connected to backend');
  })
  .catch((err) => console.log(err));

const __dirName = path.resolve()

const app = express();
app.use(express.static(path.join(__dirName,'/client/dist')))
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirName,'/client/dist/index.html'))
})

app.use(cookieParser());


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json()); // parse json on backend
app.listen(3000, () => {
  console.log('server is listening on port 3000');
});
// user route
import userRoutes from './src/routes/user.routes.js';
app.use('/api/user', userRoutes);

// auth routes
import authRoutes from './src/routes/auth.routes.js';
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server message';
  res.status(statusCode).json({
    success: false,
    message: message,
    statusCode,
  });
});
