import express from 'express';
import cors from 'cors';
import {readdirSync} from 'fs';
import mongoose from 'mongoose';
const morgan = require('morgan');
require ('dotenv').config();

 
const app = express();

//db connection
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('DB connected'))
.catch((err)=> console.log('DB connection error:', err));

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//route middleware
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

const port = process.env.PORT || 8000;

app.listen(port, ()=> console.log(`Server is running on port ${port}`));