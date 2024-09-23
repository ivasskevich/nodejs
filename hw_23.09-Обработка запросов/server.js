const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const DATA_FILE = 'Items.json';

const getDataFromFile = (callback) => {
   fs.readFile(DATA_FILE, 'utf8', (error, content) => {
      if (error) {
         console.error(`Помилка читання файлу: ${error}`);
         callback([]);
      } else {
         const items = content ? JSON.parse(content) : [];
         callback(items);
      }
   });
};

const saveDataToFile = (items, callback) => {
   fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), (error) => {
      if (error) {
         console.error(`Помилка запису файлу: ${error}`);
         callback(false);
      } else {
         callback(true);
      }
   });
};

app.get('/create', (req, res) => {
   res.send(`
        <h2>Додати новий товар</h2>
        <form action="/create" method="POST">
            <label>Назва товару:</label><br>
            <input type="text" name="itemName"><br>
            <label>Ціна:</label><br>
            <input type="number" name="itemPrice"><br>
            <label>Опис:</label><br>
            <textarea name="itemDescription"></textarea><br>
            <button type="submit">Додати</button>
        </form>
    `);
});

app.post('/create', (req, res) => {
   const newItem = {
      name: req.body.itemName,
      price: req.body.itemPrice,
      description: req.body.itemDescription,
   };

   getDataFromFile((items) => {
      items.push(newItem);
      saveDataToFile(items, (isSaved) => {
         if (isSaved) {
            res.send(`Товар успішно додано! <a href="/list">Переглянути всі товари</a>`);
         } else {
            res.status(500).send('Помилка при збереженні товару.');
         }
      });
   });
});

app.get('/update', (req, res) => {
   getDataFromFile((items) => {
      const itemOptions = items.map((item, idx) => `<option value="${idx}">${item.name}</option>`).join('');
      res.send(`
            <h2>Редагувати товар</h2>
            <form action="/update" method="POST">
                <label>Оберіть товар:</label><br>
                <select name="itemIndex">${itemOptions}</select><br>
                <label>Нова назва:</label><br>
                <input type="text" name="newName"><br>
                <label>Нова ціна:</label><br>
                <input type="number" name="newPrice"><br>
                <label>Новий опис:</label><br>
                <textarea name="newDescription"></textarea><br>
                <button type="submit">Зберегти зміни</button>
            </form>
        `);
   });
});

app.post('/update', (req, res) => {
   const index = req.body.itemIndex;
   const updatedItem = {
      name: req.body.newName,
      price: req.body.newPrice,
      description: req.body.newDescription,
   };

   getDataFromFile((items) => {
      if (items[index]) {
         items[index] = updatedItem;
         saveDataToFile(items, (isUpdated) => {
            if (isUpdated) {
               res.send('Товар успішно оновлено! <a href="/list">Переглянути всі товари</a>');
            } else {
               res.status(500).send('Помилка оновлення товару.');
            }
         });
      } else {
         res.status(400).send('Товар не знайдено.');
      }
   });
});

app.get('/list', (req, res) => {
   getDataFromFile((items) => {
      if (items.length > 0) {
         const itemList = items.map((item, index) => `
                <div>
                    <strong>${index + 1}. ${item.name}</strong><br>
                    Ціна: ${item.price} грн<br>
                    Опис: ${item.description}
                </div><br>
            `).join('');
         res.send(`<h2>Список товарів</h2>${itemList}`);
      } else {
         res.send('Немає товарів для відображення.');
      }
   });
});

app.listen(5050, () => {
   console.log(`Сервер працює на порту 5050`);
});