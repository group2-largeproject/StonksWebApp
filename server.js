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
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { restart } = require('nodemon');

app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();

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

  if(results.length > 0 && results[0].isVerified == "false")
  {
    error = "Account needs to be verified.";
  }
  // set session cookie for logout / activity
  var ret = {userId:id, firstName:fn, lastName:ln, error:error};
  res.status(200).json(ret);
});

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().alphanum().min(8).max(20),
  email: Joi.string().email().required(),
  isVerified: Joi.string().required(),
  token: Joi.required()
});

// basic register api, only takes in username and password
app.post('/api/register', async (req, res, next) =>
{
  var errordb = '';
  let verified = "false";

  // accept user input & format it to be entered into database
  const {username, password, email} = req.body;

  // MAKE SURE USER EMAIL IS NOT IN USE, SPIT ERROR IF IT IS
  const emailDbCheck = client.db();
  const emailCheck = await emailDbCheck.collection('User').findOne({email:email});
  if (emailCheck) return res.status(400).send({msg: "The email address you have entered is already associated with another account."});

  const token = crypto.randomBytes(16).toString('hex');
  const newUser = {username:username, password:password, email:email, isVerified:verified, token:token};
  const {error} = Joi.validate(newUser, registerSchema);

  // joi error check
  if(error) return res.status(400).send(error.details[0].message);

  // try to add user into the database
  try
  {
    const db = client.db();
    db.collection('User').insertOne(newUser);
    // db.collection('User').updateOne({"email":email},{ $set : {"token":token} },);
    console.log("SHITAHS ANSLKNASTA LKSALKSG BAKLSBGKASBG KLASK");
    // send email?
    var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
    var mailOptions = { from: 'michael.yeah@pm.me', to: email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: ' + process.env.BASE_URL + 'confirmation\/' + token + '\n' };
    
    console.log("Mail: " + mailOptions);
    transporter.sendMail(mailOptions, function(err){
      if (err) { return res.status(500).send({msg: err.message}); }
      res.status(200).send('A verification email has been sent to ' + email + '.');
    });
  }
  catch(e)
  {
    errordb = e.toString();
  }

  // WILL ERROR OUT WE HIT THE TRANSPORTER SEND MAIL ERROR.
  // WILL ATTEMPT TO SET AND SEND HEADERS TWICE 
  // var ret = {error:errordb};
  // res.status(200).json(ret);

});

app.post('/confirmation/:token', async(req,res,next) =>
{
  // NEED TO HANDLE ERRORS.
  // USER NOT FOUND, TOKEN NOT FOUND, etc.
  const tokCheck = client.db();
  const tokenCheck = await tokCheck.collection('User').findOne({token:req.params.token});
  if (tokenCheck)
  {
    client.db().collection('User').updateOne({"token":req.params.token},{ $set : {"isVerified":"true"} },);
  }
  // maybe delete token after verification is successful?
  res.status(200).send('Account verified.');
})

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

// https://www.npmjs.com/package/node-iex-cloud
app.post('/api/addStock', async(req, res, next) => 
{
  var error = '';
  const {stock} = req.body;
  var d = new Date();
  let newDate = getDate(d);
  let newTime = getTime(d);

  // if stock user wants to add has been added by someone else, use that data inste
  // if stock has been added but has not been updated for 2 or more hours, refresh stock
  // maybe we can add user id's to the stocks they want to track? rather than adding
  // a shit ton of the same stock per user id (lol)
  const db = client.db();
  const results = await db.collection('Stocks').find({symbol:stock}).toArray();

  if (results.length > 0)
  {
    // check if time since last refresh >= 2hrs
    // access results[0].timeUpdate = 14:30:20

    let test = results[0].timeUpdate;

    // would print out 14, following example above
    console.log("Time in hours: " + test[0] + test[1]);
      
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