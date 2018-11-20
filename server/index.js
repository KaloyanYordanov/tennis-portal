require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const errorMiddleware = require('./infrastructure/middlewares/error');

app.listen(process.env.PORT, () => console.log(`server running @ port:${process.env.PORT}`));

app.use(cors());
app.use(express.json());

app.use('/api', require('./controllers'));
app.use(errorMiddleware);