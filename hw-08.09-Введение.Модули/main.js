'use strict'

const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

class FileHandler extends EventEmitter {
   constructor() {
      super();
   }

   loadFile(fileName) {
      fs.readFile(fileName, 'utf8', (error, content) => {
         if (error) {
            console.error('Failed to load file:', error);
         } else {
            this.emit('fileLoaded', content);
         }
      });
   }

   saveFile(fileName, fileData) {
      fs.writeFile(fileName, fileData, (error) => {
         if (error) {
            console.error('Failed to save file:', error);
         } else {
            this.emit('fileSaved');
         }
      });
   }
}

let fileStream = new FileHandler();

fileStream.on('fileLoaded', (content) => {
   console.log('Content loaded:', content);
});

fileStream.on('fileSaved', () => {
   console.log('Content successfully saved');
});

const userInfo = { name: 'Alice', age: 25 };
fileStream.saveFile('data.txt', JSON.stringify(userInfo));
fileStream.loadFile('data.txt');
