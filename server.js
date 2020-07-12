const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({})
const app = express()
const mongoose = require('mongoose')
const { IEXCloudClient } = require('node-iex-cloud')
const fetch = require('node-fetch')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { restart } = require('nodemon')
const jwt = require('jsonwebtoken')
// const session = require('express-session')
// const cookieParser = require('cookie-parser')

const iex = new IEXCloudClient(fetch, {
  sandbox: true,
  publishable: process.env.STONK_TOK,
  version: "stable"
});

app.use(cors())
app.use(bodyParser.json())
require('dotenv').config();

// const router = require('./routes/index');

const PORT = process.env.PORT || 5000; 
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

app.set('port', 5000);
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

client.connect();

// app.use('/api', router); 

mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false }); 
mongoose.connection.once('open', function() { 
  console.log('Connected to the Database.');
});
mongoose.connection.on('error', function(error) {
  console.log('Mongoose Connection Error : ' + error);
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

var genRandomString = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
          .toString('hex') /** convert to hexadecimal format */
          .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
      salt:salt,
      passwordHash:value
  };
};

function saltHashPassword(userpassword) {
  var salt = genRandomString(16); /** Gives us salt of length 16 */
  var passwordData = sha512(userpassword, salt);
  // console.log('UserPassword = '+userpassword);
  // console.log('Passwordhash = '+passwordData.passwordHash);
  // console.log('nSalt = '+passwordData.salt);

  return {
    passwordHash:passwordData.passwordHash,
    salt:passwordData.salt
  };
}

// make the token and it bounces back and forth between front end and api
// every time the user does an action we extend the time left on that token
// when they switch pages, talk to api, anything will extend the token.
// DO NOT save the token to the database
app.post('/api/login', async (req, res, next) =>
{
  var error = '';
  var id = -1;
  var fn = '';
  var ln = '';
  var uname = '';
  var email = '';
  var token = '';
  var recovery = '';

  const {username, password} = req.body;
  const db = client.db();
  const results2 = await db.collection('User').find({username:username}).toArray();

  // username is valid
  if (results2.length > 0)
  {
    hashedPass = sha512(password, results2[0].salt);

    // determines whether or not the passwords match
    const results = await db.collection('User').find({username:username,password:hashedPass.passwordHash}).toArray();
    
    // username valid, password valid, account verified
    if (results.length > 0 && results[0].isVerified == "true"){
      id = results[0]._id;
      fn = results[0].firstName;
      ln = results[0].lastName;
      uname = results[0].username;
      email = results[0].email;
      recovery = results[0].recoveryMode;

      var privateKey = "poopsock"
      var token = jwt.sign({id:results[0]._id}, privateKey);
      console.log(token);
     }
    
    // username valid, password valid, account is not verified
    else if (results.length > 0 && results[0].isVerified == "false")
      error = "Account needs to be verified.";
    
    // password is invalid
    else
      error = 'Invalid username/password';
  
  }

  // if username is invalid
  else
    error = 'Invalid username/password';
    
  var ret = {username:uname,email:email,id:id,error:error,jwt:token,recovery:recovery};
  res.status(200).json(ret); 
  // set session cookie for logout / activity
  // var ret = {userId:id, firstName:fn, lastName:ln, error:error};
});

// token validation => reset token expiration
app.post('/api/validation/', async(req, rest, next) =>
{
  const {token} = req.body;

  // check the time remaining on the token to verify
  // if expired, ping back that this token is expired/useless
  // if time is left, we go ahead and reset the time left
})

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().alphanum().min(8).max(20),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  isVerified: Joi.string().required(),
  token: Joi.required(),
  dateCreated: Joi.required(),
  salt: Joi.string().required()
});

// basic register api, only takes in username and password
app.post('/register', async (req, res, next) =>
{
  var errordb = '';
  let verified = "false";
  var d = new Date();
  let newDate = getDate(d);

  // accept user input & format it to be entered into database
  const {username, password, email, firstName, lastName} = req.body;

  var {passwordHash, salt} = saltHashPassword(password);
  // salted it ^ !!!
  // temp.passwordHash = hashed password && temp.salt = salt

  // Checks to see if the email is in use, if it is then it won't let the user sign up.
  const emailDbCheck = client.db();
  const emailCheck = await emailDbCheck.collection('User').findOne({email:email});
  if (emailCheck) return res.status(400).send({msg: "The email address you have entered is already associated with another account."});

  const token = crypto.randomBytes(16).toString('hex');
  // passing new user data to joi for validation before we send him off to boating school
  // after validation, we pull the ol' 1-2 switcheroo and swap the og password with the hashed password.
  var newUser = {dateCreated:newDate, username:username, password:password, salt:salt, email:email, firstName:firstName, lastName:lastName, isVerified:verified, token:token};
  const {error} = Joi.validate(newUser, registerSchema);
  var newUser = {dateCreated:newDate, username:username, password:passwordHash, salt:salt, email:email, firstName:firstName, lastName:lastName, isVerified:verified, token:token, recoveryMode:"false", stockArray:[]};

  // joi error check
  if(error) return res.status(400).send(error.details[0].message);

  // try to add user into the database
  try
  {
    const db = client.db();
    db.collection('User').insertOne(newUser);
    
    var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
    var mailOptions = { from: 'michael.yeah@pm.me', to: email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: ' + process.env.BASE_URL + 'confirmation\/' + token + '\n' };
  }
  catch(e)
  {
    errordb = e.toString();
  }

  // WILL ERROR OUT WE HIT THE TRANSPORTER SEND MAIL ERROR.
  // WILL ATTEMPT TO SET AND SEND HEADERS TWICE 
  transporter.sendMail(mailOptions, function(err){
    if (err) { return res.status(500).send({msg: err.message, err:errordb}); }
    res.status(200).send('A verification email has been sent to ' + email + '.');
  });

});

// NEED TO HANDLE ERRORS.
// USER NOT FOUND, TOKEN NOT FOUND, etc.
// ERASE TOKEN AFTER CONFIRMATION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post('/confirmation/:token', async(req,res,next) =>
{
  const tokCheck = client.db();
  const tokenCheck = await tokCheck.collection('User').find({token:req.params.token}).toArray();

  // account verification
  if (tokenCheck.length > 0 && tokenCheck[0].isVerified == "false")
  {
    client.db().collection('User').updateOne({"token":req.params.token},{ $set : {"isVerified":"true", "token":""} },);
  }

  res.status(200).send('Account verified.');
})

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

// fetches & returns the stock symbols current price
async function fetchStock(stock)
{
  return iex.symbol(stock.toString()).price();
}

// https://www.npmjs.com/package/node-iex-cloud
// WORK ON THE RETURN JSON DATA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// User sends stock to add -> find user -> check stocks array, verify stock doesn't exist in array 
// -> check stock API to verify stock exists -> add stock to user.stock array -> EOD(separate api): ping stock API with stock array
app.post('/api/addStock', async(req, res, next) => 
{
  var error = '';
  const {username, stock} = req.body;
  // var d = new Date();
  // let newDate = getDate(d);
  // let newTime = getTime(d);

  const db = client.db();
  const results = await db.collection('User').find({username:username}).toArray();
  // const results = await db.collection('Stocks').find({symbol:"tsla"}).toArray();

  if (results.length > 0)
  {
    var array = results[0].stockArray;
    var found = array.includes(stock)
    if (found)
    {
      error = "Stock already exists on user profile."
    }
    else if (!found)
    {
      let price = await fetchStock(stock);

      // stock was found      
      if(price.message !== "Unknown symbol")
      {
        await client.db().collection('User').updateOne({"username":username},{ $push : {"stockArray":stock} },);
        console.log("yay!")
      }
      // stock not found
      else if (price.message === "Unknown symbol")
      {
        error = "Unknown symbol, please enter valid stock symbol."
        console.log("Stock not found!")
      }
      else
      {
        error = price.message
        // console.log(price.message)
      }
    }
  }
  else
  {
    error = "User does not exist"
  }

  var ret = {error:error}
  res.status(200).send(ret);
})

// takes in user email, looks for user in database
// if found: generates random password, hashes new password, stores it in database and sets recoveryMode to true on users document
// email the user their temporary password so they can login to change their password.
app.post('/api/forgot/', async(req, res, next) =>
{
  const {username, email} = req.body

  const db = client.db()
  const results = await db.collection('User').find({email:email}).toArray()

  // email exists, gen token for conf link
  if (results.length > 0)
  {
    const passRand = crypto.randomBytes(8).toString('hex')

    var {salt, passwordHash} = sha512(passRand, results[0].salt);
    db.collection('User').updateOne({"email":email},{ $set : {"recoveryMode":"true", "password":passwordHash} },)

    var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
    var mailOptions = { from: 'michael.yeah@pm.me', to: email, subject: 'Password Reset', text: 'Hello ' + results[0].username + ',\n\n' + 'Use this temporary password to login, make sure to change your password via Account Settings once logged in: ' + passRand + '\n' };
 
    transporter.sendMail(mailOptions, function(err){
      if (err) { return res.status(500).send({msg: err.message}); }
      res.status(200).send('A password reset email has been sent to ' + email + '.');
    });
  }

  if (results.length <= 0 )
    res.status(401).send("A user with that email was not found.");

})

// DELETE STOCK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// USER SETTINGS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// NOTIFICATION SETTINGS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// SIGN OUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
