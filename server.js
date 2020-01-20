const express = require("express");
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const router = express.Router();
// Use native Node promises
mongoose.Promise = global.Promise;


var Todo = require('./js/models/Todo.js');
var Network = require('./js/models/network.js');

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

// Connect to mongoDB database assuming our database name is "conext_gateway"
const mongoURL = 'mongodb://localhost/conext_gateway';

// connect to MongoDB
/* mongoose.connect(mongoURL)
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err)); */

app.use(cors(corsOptions));
app.use(bodyParser.json());


//  Serve frontend view
app.use(express.static('.'));

//APIs



// Create a todo in memory
/* var todo = new Todo({name: 'Master NodeJS', completed: false, note: 'Getting there...'});

// Save it to database
todo.save(function(err){
  if(err)
    console.log(err);
  else
    console.log(todo);
}); */


router.post('/vars', function(req, res, next) {
    if(req.headers.urlparams==='name=/SCB/WIFI_STATION/SCAN_RESULTS_JSON') {
        res.sendFile(path.join(__dirname, 'data/wifistation_settings.json'), req.body)
    }
}) 

/* GET /todos listing. */
router.get('/todos', function(req, res, next) {
    Todo.find(function (err, todos) {
        if (err) return next(err);
        res.json(todos);
    });
});

/* POST /Network Manual */
router.post('/setparams', function(req, res, next) {
    console.log(req.headers)
    Network.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});



//Examples

/* POST /todos */
/* router.post('/', function(req, res, next) {
    Todo.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
}); */

/* GET /todos/id */
/* router.get('/:id', function(req, res, next) {
    Todo.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
}); */
/* PUT /todos/:id */
/* router.put('/:id', function(req, res, next) {
    Todo.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
}); */
/* DELETE /todos/:id */
/* router.delete('/:id', function(req, res, next) {
    Todo.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
}); */






app.use(router);


// Configure port
const port = 3000;


app.listen(3000, () => {
    console.log(`Server is running on port: ${port}`)
});