const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
let register = express();
let enter = express();
let main = express();

app.use(bodyParser.urlencoded({ extended: true }));
const usersFilePath = path.join(__dirname, 'users.json');
app.use(express.static('html'));

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'html', 'app.html'));
});

register.post('/', (req, res) => {
   const { userId, password, name, address, country, zip, email, sex, language, about } = req.body;

   const newUser = { userId, password, name, address, country, zip, email, sex, language, about };

   fs.readFile(usersFilePath, (err, data) => {
      if (err) throw err;
      let users = [];

      if (data.length > 0) {
         users = JSON.parse(data);
      }

      users.push(newUser);

      fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
         if (err) throw err;
         res.redirect('/main');
      });
   });
});

enter.post('/', (req, res) => {
   const { email, password } = req.body;

   fs.readFile(usersFilePath, (err, data) => {
      if (err) throw err;

      let users = JSON.parse(data);

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
         res.redirect('/main');
      } else {
         res.send('Invalid email or password <a href="/main">main</a>');
      }
   });
});

main.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'html', 'main.html'));
});

register.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

enter.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'html', 'enter.html'));
});

app.use('/register', register);
app.use('/enter', enter);
app.use('/main', main);

const port = 2020;
app.listen(port, () => {
   console.log(`Server here http://localhost:${port}`);
});
