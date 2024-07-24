const express = require('express');
const app = express();
const PORT = process.env.PORT || 3049;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const writeRead = require('./routes/writeRead.js');
app.use('/wr/api', writeRead);

app.use('/', function (req, res, next) {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});


