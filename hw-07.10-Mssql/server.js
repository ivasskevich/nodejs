let express = require('express');
let app = express();
let book = express();
let author = express();
let publisher = express();
let student = express();
let teacher = express();
let themes = express();

let port = 1010;
let mssql = require('mssql');

let config = {
   server: 'DESKTOP-378JF7Y\\SQLEXPRESS',
   database: 'Library',
   user: 'admin',
   password: 'fwefw',
   options: {
      encrypt: true,
      trustServerCertificate: true
   }
};

app.get('/', function (req, res) {
   res.send('main');
});

book.get('/', function (req, res) {
   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Database connection error');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      ps.prepare('SELECT Id, Name, Pages, YearPress FROM Books', function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Request preparation error');
            return;
         }

         ps.execute({}, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Request execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send('No books found');
            } else {
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>Name</th>
                              <th>Pages</th>
                              <th>YearPress</th>
                           </tr>`;

               result.recordset.forEach(function (book) {
                  html += `<tr>
                              <td>${book.Id}</td>
                              <td>${book.Name}</td>
                              <td>${book.Pages}</td>
                              <td>${book.YearPress}</td>
                           </tr>`;
               });

               html += `</table>`;

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Data sent');
         });
      });
   });
});

book.get('/:id', function (req, res) {
   let flightId = req.params.id;

   if (isNaN(flightId)) {
      res.status(400).send('Error: parameter must be a number');
      return;
   }

   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Database connection error');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      ps.input('param', mssql.Int);

      ps.prepare('SELECT * FROM Books WHERE Id = @param', function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Request preparation error');
            return;
         }

         ps.execute({ param: flightId }, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Request execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send('Does not have such a number');
            } else {
               let book = result.recordset[0];
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>Name</th>
                              <th>Pages</th>
                              <th>YearPress</th>
                           </tr>
                           <tr>
                              <td>${book.Id}</td>
                              <td>${book.Name}</td>
                              <td>${book.Pages}</td>
                              <td>${book.YearPress}</td>
                           </tr>
                           </table>`;

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Data sent');
         });
      });
   });
});

author.get('/', function (req, res) {
   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Database connection error');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      let query = `SELECT Id, FirstName, LastName FROM Authors`;

      ps.prepare(query, function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Request preparation error');
            return;
         }

         ps.execute({}, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Request execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send('No authors in the database');
            } else {
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                           </tr>`;

               result.recordset.forEach(author => {
                  html += `<tr>
                              <td>${author.Id}</td>
                              <td>${author.FirstName}</td>
                              <td>${author.LastName}</td>
                           </tr>`;
               });

               html += '</table>';

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Authors data sent');
         });
      });
   });
});

author.get('/:name', function (req, res) {
   let authorName = req.params.name;

   let [firstName, lastName] = authorName.split('-');

   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Database connection error');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      ps.input('firstName', mssql.NVarChar);
      ps.input('lastName', mssql.NVarChar);

      let query = `
           SELECT Books.Id, Books.Name, Books.Pages, Books.YearPress
           FROM Books
           JOIN Authors ON Books.Id_Author = Authors.Id
           WHERE Authors.FirstName = @firstName AND Authors.LastName = @lastName
       `;

      ps.prepare(query, function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Request preparation error');
            return;
         }

         ps.execute({ firstName: firstName || '', lastName: lastName || '' }, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Request execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send('No books for this author');
            } else {
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>Name</th>
                              <th>Pages</th>
                              <th>YearPress</th>
                           </tr>`;

               result.recordset.forEach(book => {
                  html += `<tr>
                              <td>${book.Id}</td>
                              <td>${book.Name}</td>
                              <td>${book.Pages}</td>
                              <td>${book.YearPress}</td>
                           </tr>`;
               });

               html += '</table>';

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Data sent');
         });
      });
   });
});

publisher.get('/', function (req, res) {
   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Error connecting to the database');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      let query = `SELECT Press.Id, Press.Name FROM Press`;

      ps.prepare(query, function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Error in preparing a request');
            return;
         }

         ps.execute({}, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Request execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send('No publishers in the database');
            } else {
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>Name</th>
                           </tr>`;

               result.recordset.forEach(publisher => {
                  html += `<tr>
                              <td>${publisher.Id}</td>
                              <td>${publisher.Name}</td>
                           </tr>`;
               });

               html += '</table>';

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Press data sent');
         });
      });
   });
});

publisher.get('/:name', function (req, res) {
   let publisherName = req.params.name;

   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Error connecting to the database');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      ps.input('publisherName', mssql.NVarChar);

      let query = `
           SELECT Books.Id, Books.Name, Books.Pages, Books.YearPress
           FROM Books
           JOIN Press ON Books.Id_Press = Press.Id
           WHERE Press.Name = @publisherName
       `;

      ps.prepare(query, function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Error in preparing the request');
            return;
         }

         ps.execute({ publisherName: publisherName || '' }, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Query execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send('No books for this publisher');
            } else {
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>Name</th>
                              <th>Pages</th>
                              <th>YearPress</th>
                           </tr>`;

               result.recordset.forEach(book => {
                  html += `<tr>
                              <td>${book.Id}</td>
                              <td>${book.Name}</td>
                              <td>${book.Pages}</td>
                              <td>${book.YearPress}</td>
                           </tr>`;
               });

               html += '</table>';

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Data sent');
         });
      });
   });
});

student.get('/', function (req, res) {
   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Error connecting to the database');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      let query = `SELECT Students.Id, Students.FirstName, Students.LastName FROM Students`;

      ps.prepare(query, function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Error in preparing a request');
            return;
         }

         ps.execute({}, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Request execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send('No students in the database');
            } else {
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>FirstName</th>
                              <th>LastName</th>
                           </tr>`;

               result.recordset.forEach(publisher => {
                  html += `<tr>
                              <td>${publisher.Id}</td>
                              <td>${publisher.FirstName}</td>
                              <td>${publisher.LastName}</td>
                           </tr>`;
               });

               html += '</table>';

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Student data sent');
         });
      });
   });
});

student.get('/:groupName', function (req, res) {
   let groupName = req.params.groupName;

   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Error connecting to the database');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      ps.input('groupName', mssql.NVarChar);

      let query = `
           SELECT Students.Id, Students.FirstName, Students.LastName 
           FROM Students
           JOIN Groups ON Students.Id_Group = Groups.Id
           WHERE Groups.Name = @groupName
       `;

      ps.prepare(query, function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Error in preparing a request');
            return;
         }

         ps.execute({ groupName: groupName || '' }, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Request execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send(`No students for the group ${groupName}`);
            } else {
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>FirstName</th>
                              <th>LastName</th>
                           </tr>`;

               result.recordset.forEach(student => {
                  html += `<tr>
                              <td>${student.Id}</td>
                              <td>${student.FirstName}</td>
                              <td>${student.LastName}</td>
                           </tr>`;
               });

               html += '</table>';

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Students data sent');
         });
      });
   });
});

teacher.get('/', function (req, res) {
   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Error connecting to the database');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      let query = `SELECT Teachers.Id, Teachers.FirstName, Teachers.LastName FROM Teachers`;

      ps.prepare(query, function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Error in preparing a request');
            return;
         }

         ps.execute({}, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Request execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send('No teachers in the database');
            } else {
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>FirstName</th>
                              <th>LastName</th>
                           </tr>`;

               result.recordset.forEach(publisher => {
                  html += `<tr>
                              <td>${publisher.Id}</td>
                              <td>${publisher.FirstName}</td>
                              <td>${publisher.LastName}</td>
                           </tr>`;
               });

               html += '</table>';

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Teacher data sent');
         });
      });
   });
});

themes.get('/', function (req, res) {
   let connection = new mssql.ConnectionPool(config);

   connection.connect(function (err) {
      if (err) {
         console.log(err);
         res.status(500).send('Error connecting to the database');
         return;
      }

      let ps = new mssql.PreparedStatement(connection);

      let query = `SELECT Themes.Id, Themes.Name FROM Themes`;

      ps.prepare(query, function (err) {
         if (err) {
            console.log(err);
            res.status(500).send('Error in preparing a request');
            return;
         }

         ps.execute({}, function (err, result) {
            if (err) {
               console.log(err);
               res.status(500).send('Request execution error');
               return;
            }

            if (result.recordset.length === 0) {
               res.send('No faculties in the database');
            } else {
               let html = `<table border="1" cellpadding="5" cellspacing="0">
                           <tr>
                              <th>Id</th>
                              <th>Name</th>
                           </tr>`;

               result.recordset.forEach(publisher => {
                  html += `<tr>
                              <td>${publisher.Id}</td>
                              <td>${publisher.Name}</td>

                           </tr>`;
               });

               html += '</table>';

               res.send(html);
            }

            ps.unprepare(function (err) {
               if (err) console.log(err);
            });

            console.log('Themes data sent');
         });
      });
   });
});

app.use('/book', book);
app.use('/author', author);
app.use('/publisher', publisher);
app.use('/student', student);
app.use('/teacher', teacher);
app.use('/themes', themes);

app.listen(port, function () {
   console.log('app listening on port ' + port);
});
