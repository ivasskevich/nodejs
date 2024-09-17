const fs = require('fs');

class Person {
   constructor(fullName, years) {
      this.fullName = fullName;
      this.years = years;
   }

   toString() {
      return `Full Name: ${this.fullName}, Years: ${this.years}`;
   }
}

class Instructor extends Person {
   constructor(fullName, years, specialty) {
      super(fullName, years);
      this.specialty = specialty;
   }

   toString() {
      return `Full Name: ${this.fullName}, Years: ${this.years}, Specialty: ${this.specialty}`;
   }
}

class Learner extends Person {
   constructor(fullName, years, result) {
      super(fullName, years);
      this.result = result;
   }

   toString() {
      return `Full Name: ${this.fullName}, Years: ${this.years}, Result: ${this.result}`;
   }
}

class Chauffeur extends Person {
   constructor(fullName, years, vehicle) {
      super(fullName, years);
      this.vehicle = vehicle;
   }

   toString() {
      return `Full Name: ${this.fullName}, Years: ${this.years}, Vehicle: ${this.vehicle}`;
   }
}

function saveObjectToFile(filePath, entity) {
   const content = JSON.stringify(entity);
   fs.writeFile(filePath, content, (err) => {
      if (err) {
         console.error('Error while saving:', err);
      } else {
         console.log('Entity successfully saved to file.');
      }
   });
}

function saveEntitiesToFile(filePath, entities) {
   const content = JSON.stringify(entities);
   fs.writeFile(filePath, content, (err) => {
      if (err) {
         console.error('Error while saving entities:', err);
      } else {
         console.log('Entities successfully saved to file.');
      }
   });
}

function loadEntitiesFromFile(filePath) {
   fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
         console.error('Error while loading from file:', err);
      } else {
         const entities = JSON.parse(content);
         console.log('Entities loaded from file:', entities);
      }
   });
}

function appendEntityToFile(filePath, entity) {
   fs.readFile(filePath, 'utf-8', (err, content) => {
      let currentContent = [];
      if (!err && content) {
         currentContent = JSON.parse(content);
      }

      currentContent.push(entity);

      fs.writeFile(filePath, JSON.stringify(currentContent), (err) => {
         if (err) {
            console.error('Error while appending:', err);
         } else {
            console.log('Entity successfully appended to file.');
         }
      });
   });
}

const instructor = new Instructor('David', 50, 'Physics');
const learner = new Learner('Emma', 22, 'B+');
const chauffeur = new Chauffeur('Sam', 40, 'Ford');

const filePath = 'peopleData.json';

saveObjectToFile('instructor.json', instructor);

saveEntitiesToFile(filePath, [instructor, learner, chauffeur]);

loadEntitiesFromFile(filePath);

appendEntityToFile(filePath, new Chauffeur('George', 55, 'BMW'));

loadEntitiesFromFile(filePath);
