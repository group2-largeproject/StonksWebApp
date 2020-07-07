const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const app = express();
const mongoose = require('mongoose');
const { IEXCloudClient } = require('node-iex-cloud');
const fetch = require('node-fetch');

app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().alphanum().min(8).max(20),
  email: Joi.string().email().required()
});

const iex = new IEXCloudClient(fetch, {
  sandbox: true,
  publishable: process.env.STONK_TOK,
  version: "stable"
});


// const router = require('./routes/index');

const PORT = process.env.PORT || 5000; 
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

app.set('port', 5000);
app.use(express.static(path.join(__dirname, '/client/public')));

client.connect();

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

  const {username, password} = req.body;
  const db = client.db();
  const results = await db.collection('User').find({username:username,password:password}).toArray();
  
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

async function fetchStock(stock)
{
  return iex.symbol(stock.toString()).price();
}

app.post('/api/addStock', async(req, res, next) => 
{
  // https://www.npmjs.com/package/node-iex-cloud


  var error = '';
  const {stock} = req.body;
  const db = client.db();

  // if stock user wants to add has been added by someone else, use that data inste
  // if stock has been added but has not been updated for 2 or more hours, refresh stock
  // maybe we can add user id's to the stocks they want to track? rather than adding
  // a shit ton of the same stock per user id (lol)
  const results = await db.collection('Stocks').find({symbol:stock}).toArray();

  if (results.length > 0)
  {
    let price = results[0].currentPrice;
    console.log("COMMUNAL STONKS: " + price);
    const oldStock = {symbol:stock,currentPrice:price};

    console.log(oldStock);
    var ret = {error:error}
    res.status(200).json(ret);
  }
  else if(results.length == 0)
  {
    let price = await fetchStock(stock);
    const newStock = {symbol:stock,currentPrice:price};

    try
    {
      const db = client.db();
      const result = db.collection('Stocks').insertOne(newStock);
    }
    catch(e)
    {
      error = e.toString();
    }

    console.log("NEW STONK: " + price);
    console.log(newStock);
    var ret = {error:error}
    res.status(200).json(ret);
  }
})

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