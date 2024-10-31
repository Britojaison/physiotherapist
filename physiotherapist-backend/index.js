const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
const cors = require("cors");

app.use(cors());

// Helper function to read data.json
const readData = () => {
  const data = fs.readFileSync('./data.json');
  return JSON.parse(data);
};

// Helper function to write to data.json
const writeData = (data) => {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
};

// Endpoint to fetch categories and exercises
app.get('/api/exercises', (req, res) => {
  const data = readData();
  res.json(data.categories);
});

// Endpoint to save a new exercise program
app.post('/api/programs', (req, res) => {
  const data = readData();
  data.programs.push(req.body);
  writeData(data);
  res.json({ message: 'Program saved successfully!' });
});

// Endpoint to fetch saved programs
app.get('/api/programs', (req, res) => {
  const data = readData();
  res.json(data.programs);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
