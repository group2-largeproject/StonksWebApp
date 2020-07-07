const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const app = express();
app.use(cors());
app.use(bodyParser.json());
const mongoose = require('mongoose');
require('dotenv').config();


// const router = require('./routes/index');

const PORT = process.env.PORT || 5000; 
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);
app.set('port', 5000);

app.use(express.static(path.join(__dirname, '/client/public')));

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

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().alphanum().min(8).max(20),
  email: Joi.string().email().required()
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
    id = results[0]._id;
    fn = results[0].firstName;
    ln = results[0].lastName;
  }
  else
  {
    error = 'Invalid username/password';
  }
  
  var ret = {userId:id, firstName:fn, lastName:ln, error:error};
  res.status(200).json(ret);
});

// basic register api, only takes in username and password
app.post('/api/register', async (req, res, next) =>
{
  const {username, password, email} = req.body;

  const newUser = {username:username, password:password, email:email};

  const {error} = Joi.validate(newUser, registerSchema);
  var errordb = '';
  if(error) return res.status(400).send(error.details[0].message);

  try
  {
    const db = client.db();
    const result = db.collection('User').insertOne(newUser);
  }
  catch(e)
  {
    errordb = e.toString();
  }

  var ret = {error:errordb};
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