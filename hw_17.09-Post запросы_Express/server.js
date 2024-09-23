const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

let visitCounter = 0;

function logVisit() {
   visitCounter++;
   console.log(`Total site visits: ${visitCounter}`);
}

app.get('/', (req, res) => {
   logVisit();
   console.log(`Page requested: ${req.url}`);
   res.sendFile(path.resolve(__dirname, 'data', 'html', 'main.html'));
});

app.get('/register', (req, res) => {
   logVisit();
   console.log(`Page requested: ${req.url}`);
   res.sendFile(path.resolve(__dirname, 'data', 'html', 'registr.html'));
});

app.post('/register', (req, res) => {
   const userInfo = `User: ${req.body.username}, Email: ${req.body.email}, Password: ${req.body.password}\n`;

   fs.appendFile('users_db.txt', userInfo, (error) => {
      if (error) {
         console.error('Failed to register user:', error);
         res.status(500).send('Internal server error');
         return;
      }
      console.log('New user registered:', req.body.username);
      res.send('Successfully registered! <a href="/login">Go to login</a>');
   });
});

app.get('/login', (req, res) => {
   logVisit();
   console.log(`Page requested: ${req.url}`);
   res.sendFile(path.resolve(__dirname, 'data', 'html', 'entry.html'));
});

app.post('/login', (req, res) => {
   const { username, password } = req.body;

   fs.readFile('users_db.txt', 'utf-8', (error, data) => {
      if (error) {
         console.error('Failed to read user data:', error);
         res.status(500).send('Internal server error');
         return;
      }

      const users = data.split('\n');
      const validUser = users.some(user => {
         const [storedUsername, , storedPassword] = user.split(', ');
         return storedUsername.includes(username) && storedPassword.includes(password);
      });

      if (validUser) {
         res.send(`Welcome, ${username}!`);
      } else {
         res.send('Login failed. Incorrect username or password.');
      }
   });
});

app.use((req, res) => {
   logVisit();
   console.log(`Invalid page request: ${req.url}`);
   res.status(404).sendFile(path.resolve(__dirname, 'data', 'html', 'error.html'));
});

app.listen(3000, () => {
   console.log('Server running on port 3000');
});
