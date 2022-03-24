import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

app.use(bodyParser.json({ limit : "30mb", extended : true }));
app.use(bodyParser.urlencoded({ limit : "30mb", extended : true }));
app.use(cors());
dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
.then(() => app.listen(PORT, () => {
    console.log(`DB Connection Established & Server Running on Port : ${PORT}`);
}))
.catch((error) => {
    console.error(error.message);
})