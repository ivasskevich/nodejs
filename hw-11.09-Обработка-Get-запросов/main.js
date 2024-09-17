const http = require('http');
const fs = require('fs');
const path = require('path');

const serverPort = 3000;

const webServer = http.createServer(function (request, response) {

   request.on('error', function (error) {
      console.error('Request error:', error);
   });

   let filePath;

   if (request.url === '/') {
      filePath = path.join(__dirname, 'home.html');
      fs.readFile(filePath, function (error, content) {
         if (error) {
            console.error('Error loading file:', error);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('Page not found!');
         } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content.toString());
         }
         response.end();
      });
   }
   else if (request.url === '/info') {
      filePath = path.join(__dirname, 'info.html');
      fs.readFile(filePath, function (error, content) {
         if (error) {
            console.error('Error loading file:', error);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('Page not found!');
         } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content.toString());
         }
         response.end();
      });
   }
   else if (request.url === '/signup') {
      filePath = path.join(__dirname, 'signup.html');
      fs.readFile(filePath, function (error, content) {
         if (error) {
            console.error('Error loading file:', error);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('Page not found!');
         } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content.toString());
         }
         response.end();
      });
   }
   else if (request.url === '/login') {
      filePath = path.join(__dirname, 'login.html');
      fs.readFile(filePath, function (error, content) {
         if (error) {
            console.error('Error loading file:', error);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write('Page not found!');
         } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content.toString());
         }
         response.end();
      });
   }
   else {
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.write('<h1>404 - Page Not Found</h1><br><a class="back-link" href="/">Go Back</a>');
      response.end();
   }

}).listen(serverPort);

console.log('Web server is running on port ' + serverPort);