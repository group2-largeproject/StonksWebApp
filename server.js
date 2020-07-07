const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const mongoose = require('mongoose');


// const router = require('./routes/index');

const PORT = process.env.PORT || 5000; 
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Jason_Rod:pEyQefCge8UuYH0l@cop4331-7exdq.mongodb.net/COP4331_Large_Project_Database?retryWrites=true&w=majority";
const client = new MongoClient(uri);
app.set('port', 5000);

app.use(express.static(path.join(__dirname, '/client/public')));

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
client.connect();

// app.use(cors())
// app.use(express.urlencoded({ extended: true })); 
// app.use(express.json());
// app.use('/api', router); 

mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false }); 
mongoose.connection.once('open', function() { 
  console.log('Connected to the Database.');
});
mongoose.connection.on('error', function(error) {
  console.log('Mongoose Connection Error : ' + error);
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/client/public/index.html'))
});

app.post('/api/login', async (req, res, next) =>
{
  var error = '';

  const {login, password} = req.body;
  const db = client.db();
  const results = await db.collection('User').find({username:login,password:password}).toArray();
  
  var id = -1;
  var fn = '';
  var ln = '';

  if ( results.length > 0 )
  {
    id = results[0].userId;
    fn = results[0].firstName;
    ln = results[0].lastName;
    // console.log('WE ARE ALIVE: ' + results[0].firstName);
    // console.log('Last: ' + results[0].lastName);
    // console.log('id: ' + results[0].userId);
  }
  else
  {
    error = 'Invalid username/password';
  }
  
  var ret = {userId:id, firstName:fn, lastName:ln, error:error};
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) =>
{
  const {username, password} = req.body;

  const newUser = {username:username, password:password};
  var error = '';

  try
  {
    const db = client.db();
    const result = db.collection('User').insertOne(newUser);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = {error:error};
  res.status(200).json(ret);

});

app.use((req, res, next) => 
{  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(    
        'Access-Control-Allow-Headers',    
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'  
        );  
    res.setHeader(    
        'Access-Control-Allow-Methods',    
        'GET, POST, PATCH, DELETE, OPTIONS'  
    );  
    next();
});

app.listen(PORT, function() { 
  console.log(`Server listening on port ${PORT}.`);
});