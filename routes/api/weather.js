const express = require('express');
const fetch = require('node-fetch');
const secretKey = require('../../config/keys').secretKey;

const router = express.Router();

router.post('/weather', async ({ body: { lat, lng, formattedDate } }, res) => {
    try {
        const response = await fetch(`https://api.darksky.net/forecast/${process.env.SECRET_KEY}/${lat},${lng},${formattedDate}?units=ca`);
        const data = await response.json();

        res.send(data);
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
