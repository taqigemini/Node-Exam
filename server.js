const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' }
];

const tokens = {}; 

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const token = Math.random().toString(36).substr(2); 
  tokens[token] = username;
  res.json({ token });
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !tokens[token]) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = tokens[token];
  next();
};

app.use('/private', authenticate);

app.get('/public/:img', (req, res) => {
  const imgPath = `public/${req.params.img}`;
  res.sendFile(__dirname + '/' + imgPath);
});

app.get('/private/:img', (req, res) => {
  const imgPath = `private/${req.params.img}`;
  res.sendFile(__dirname + '/' + imgPath);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
