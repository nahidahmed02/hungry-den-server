const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();


app.get('/', (req, res) => {
    res.send('friends kebab server');
});

app.listen(port, () => {
    console.log('listening to port', port);
});