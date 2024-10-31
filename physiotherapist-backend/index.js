const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
const cors = require("cors");

app.use(cors());

const readData = () => {
  const data = fs.readFileSync('./data.json');
  console.log("reading yaa reading!")
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
};

app.get('/api/exercises', (req, res) => {
  const data = readData();
  res.json(data.categories);
});

app.post('/api/programs', (req, res) => {
  const data = readData();
  data.programs.push(req.body);
  writeData(data);
  res.json({ message: 'Program saved successfully!' });
});

app.get('/api/programs', (req, res) => {
  const data = readData();
  res.json(data.programs);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
