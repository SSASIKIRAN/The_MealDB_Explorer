require('dotenv').config();
const express = require('express');
const cors = require('cors');
const meals = require('./routes/meals');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', meals);

app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'TheMealDB Explorer backend' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
