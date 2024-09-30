const expressApp = require('express');
const fileSystem = require('fs');
const appInstance = expressApp();
const itemRouter = expressApp.Router();
const sectionRouter = expressApp.Router();
const serverPort = 2545;

const itemsFilePath = './txt/product.txt';
const sectionsFilePath = './txt/category.txt';

appInstance.get("/", (req, res) => {
   res.send(`
      <h1>Головна сторінка</h1>
      <p>Перейдіть на <a href="/items">Продукти</a> або <a href="/sections">Категорії</a>.</p>
   `);
});

itemRouter.route('/')
   .get((req, res) => {
      fileSystem.readFile(itemsFilePath, 'utf8', (error, data) => {
         if (error) {
            return res.status(500).send('<h1>Помилка читання файлу продуктів.</h1>');
         }
         const itemList = data.split('\n').filter(Boolean);
         const formattedItems = itemList.map(item => `<li>${item}</li>`).join('');
         res.send(`
            <h1>Список продуктів</h1>
            <ul>${formattedItems}</ul>
            <a href="/">Повернутися на головну</a>
         `);
      });
   });

itemRouter.route('/:itemName')
   .get((req, res) => {
      const searchItem = req.params.itemName;
      fileSystem.readFile(itemsFilePath, 'utf8', (error, data) => {
         if (error) {
            return res.status(500).send('<h1>Помилка читання файлу продуктів.</h1>');
         }
         const itemList = data.split('\n').filter(Boolean);
         const foundItem = itemList.find(item => item.toLowerCase() === searchItem.toLowerCase());

         if (foundItem) {
            res.send(`
               <h1>Продукт: ${foundItem}</h1>
               <a href="/items">Повернутися до списку продуктів</a>
            `);
         } else {
            res.status(404).send(`
               <h1>Продукт ${searchItem} не знайдено.</h1>
               <a href="/items">Повернутися до списку продуктів</a>
            `);
         }
      });
   });

appInstance.use('/items', itemRouter);

sectionRouter.route('/')
   .get((req, res) => {
      fileSystem.readFile(sectionsFilePath, 'utf8', (error, data) => {
         if (error) {
            return res.status(500).send('<h1>Помилка читання файлу категорій.</h1>');
         }
         const sectionList = data.split('\n').filter(Boolean);
         const formattedSections = sectionList.map(section => `<li>${section}</li>`).join('');
         res.send(`
            <h1>Список категорій</h1>
            <ul>${formattedSections}</ul>
            <a href="/">Повернутися на головну</a>
         `);
      });
   });

sectionRouter.route('/:sectionId')
   .get((req, res) => {
      const searchSectionId = req.params.sectionId;
      fileSystem.readFile(sectionsFilePath, 'utf8', (error, data) => {
         if (error) {
            return res.status(500).send('<h1>Помилка читання файлу категорій.</h1>');
         }
         const sectionList = data.split('\n').filter(Boolean);
         const foundSection = sectionList.find(section => section.startsWith(searchSectionId + ' '));

         if (foundSection) {
            res.send(`
               <h1>Категорія: ${foundSection}</h1>
               <a href="/sections">Повернутися до списку категорій</a>
            `);
         } else {
            res.status(404).send(`
               <h1>Категорію з ID ${searchSectionId} не знайдено.</h1>
               <a href="/sections">Повернутися до списку категорій</a>
            `);
         }
      });
   });

appInstance.use('/sections', sectionRouter);

appInstance.listen(serverPort, () => {
   console.log(`Сервер запущений на http://localhost:${serverPort}`);
});
