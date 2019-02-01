const express = require('express');
const fetch = require('node-fetch');
const moment = require('moment');
const secretKey = require('../../config/keys').secretKey;

const router = express.Router();

router.post('/weather', async ({ body: { lat, lng } }, res) => {
    try {
        const time = moment().format();
        const response = await fetch(`https://api.darksky.net/forecast/${secretKey}/${lat},${lng},${time}?units=si`);
        const data = await response.json();

        res.send(data);
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
