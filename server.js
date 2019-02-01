const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const weather = require('./routes/api/weather');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Use Routes
app.use('/api/weather', weather);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is up and running on port ${port}`));
