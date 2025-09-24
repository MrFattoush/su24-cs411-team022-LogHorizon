/*
CHATGPT EXPLANATION FOR HOW TO CONNECT FRONT END TO BACKEND

Update your HTML form (index.ejs or index.html) to include the correct action attribute and method:

<form action="/signin" method="POST">
  <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
  
  <div class="form-floating">
    <input type="email" class="form-control" id="floatingInput" name="email" placeholder="name@example.com">
    <label for="floatingInput">Email address</label>
  </div>
  <div class="form-floating">
    <input type="password" class="form-control" id="floatingPassword" name="password" placeholder="Password">
    <label for="floatingPassword">Password</label>
  </div>

  <div class="form-check text-start my-3">
    <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
    <label class="form-check-label" for="flexCheckDefault">Remember me</label>
  </div>
  
  <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
  <p class="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
</form>


FOR BACKEND:
In your Node.js backend (app.js or server.js), 
you need to handle the POST request from the form. 
Make sure you have body-parser middleware installed to parse incoming request bodies:

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');

var connection = mysql.createConnection({
  host: '34.72.44.127',
  user: 'root',
  password: 'abc123',
  database: 'GameRecommender'
});

var app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

app.post('/signin', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  // Perform authentication or database operations here
  // Example of querying database
  connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(err, results) {
    if (err) throw err;

    if (results.length > 0) {
      // Successful login
      res.redirect('/success');
    } else {
      // Failed login
      res.send('Invalid credentials');
    }
  });
});

app.get('/success', function(req, res) {
  res.send('Attendance marked successfully!');
});

// Server setup
app.listen(3000, function() {
  console.log('Server is running on port 3000');
});

*/




var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.72.44.127',
                user: 'root',
                password: 'abc123',
                database: 'GameRecommender'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

app.get('/success', function(req, res) {
      res.send({'message': 'Attendance marked successfully!'});
});
 
// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var netid = req.body.netid;
   
  var sql = `INSERT INTO attendance (netid, present) VALUES ('${netid}',1)`;


// does this work?? idfk
app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});

console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});

app.get('/api/attendance', function(req, res) {
  var sql = 'SELECT * FROM attendance';

  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error fetching attendance data:', err);
      res.status(500).send({ message: 'Error fetching attendance data', error: err });
      return;
    }
    res.json(results);
  });
});

app.post('/api/attendance/modify/:id', function(req, res) {
  var id = req.params.id;
  var present = req.body.present; // Assuming 'present' is sent in the request body

  var sql = 'UPDATE attendance SET present = ? WHERE netid = ?';

  connection.query(sql, [present, id], function(err, result) {
    if (err) {
      console.error('Error modifying attendance record:', err);
      res.status(500).send({ message: 'Error modifying attendance record', error: err });
      return;
    }
    if(result.affectedRows === 0) {
      // No rows were affected, meaning no record was found with that ID
      res.status(404).send({ message: 'Record not found' });
    } else {
      res.send({ message: 'Attendance record modified successfully' });
    }
  });
});

app.delete('/api/attendance/delete/:id', function(req, res) {
  var id = req.params.id;

  var sql = 'DELETE FROM attendance WHERE netid = ?';

  connection.query(sql, [id], function(err, result) {
    if (err) {
      console.error('Error deleting attendance record:', err);
      res.status(500).send({ message: 'Error deleting attendance record', error: err });
      return;
    }
    if(result.affectedRows === 0) {
      // No rows were affected, meaning no record was found with that ID
      res.status(404).send({ message: 'Record not found' });
    } else {
      res.send({ message: 'Attendance record deleted successfully' });
    }
  });
});


app.listen(80, function () {
    console.log('Node app is running on port 80');
});
