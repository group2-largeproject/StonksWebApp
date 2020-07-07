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

// fetches & returns the stock symbols current price
async function fetchStock(stock)
{
  return iex.symbol(stock.toString()).price();
}

// adds zeros to the time/date if it is any digit less than 10
// e.g if minutes = 7 this function will turn minutes into "07".
function addZero(i)
{
  if (i < 10)
  {
    i = "0" + i;
  }
  return i;
}

// gets the current date in UTC format.
// YEAR/MONTH/DAY
function getDate(d)
{
  // Days: 1 = Sunday, 2 = Monday, 3 = Tuesday, 4 = Wednesday, etc.
  var day = addZero(d.getUTCDate() + 1);

  // Month: 1 = Jan, 2 = Feb, 3 = March, 4 = April, etc.
  var month = addZero(d.getUTCMonth() + 1);  
  var year = d.getUTCFullYear();
  newDate = year + "/" + month + "/" + day;
  return newDate;
}

// gets the current time in UTC format.
// HOURS:MINUTES:SECONDS
function getTime(d)
{
  var hours = addZero(d.getUTCHours());
  var min = addZero(d.getUTCMinutes());
  var sec = addZero(d.getUTCSeconds());
  newTime = hours + ":" + min + ":" + sec;
  return newTime;
}

app.post('/api/addStock', async(req, res, next) => 
{
  // https://www.npmjs.com/package/node-iex-cloud

  var error = '';
  const {stock} = req.body;
  var d = new Date();
  let newDate = getDate(d);
  let newTime = getTime(d);
  const db = client.db();

  // if stock user wants to add has been added by someone else, use that data inste
  // if stock has been added but has not been updated for 2 or more hours, refresh stock
  // maybe we can add user id's to the stocks they want to track? rather than adding
  // a shit ton of the same stock per user id (lol)
  const results = await db.collection('Stocks').find({symbol:stock}).toArray();

  if (results.length > 0)
  {
    let price = results[0].currentPrice;

    // const oldStock = {symbol:stock,currentPrice:price,dateUpdated:newDate,timeUpdated:newTime};
    const updateTime = {dateUpdated:newDate,timeUpdated:newTime};
    const result = db.collection('Stocks').updateOne({"symbol":stock},{ $set : {"dateUpdate":newDate, "timeUpdate":newTime} },);

    var ret = {error:error}
    res.status(200).json(ret);
  }
  else if(results.length == 0)
  {
    let price = await fetchStock(stock);
    const newStock = {symbol:stock,currentPrice:price,dateUpdated:newDate,timeUpdated:newTime};

    try
    {
      const db = client.db();
      const result = db.collection('Stocks').insertOne(newStock);
    }
    catch(e)
    {
      error = e.toString();
    }

    // console.log("NEW STONK: " + price);
    // console.log(newStock);
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
})

app.listen(PORT, function() { 
  console.log(`Server listening on port ${PORT}.`);
});