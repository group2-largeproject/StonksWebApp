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
const { isNull } = require('util')
const { json } = require('body-parser')
// const session = require('express-session')
// const cookieParser = require('cookie-parser')

const iex = new IEXCloudClient(fetch, {
  sandbox: true,
  publishable: process.env.STONK_TOK,
  version: "stable"
})

app.use(cors())
app.use(bodyParser.json())
require('dotenv').config()

// const router = require('./routes/index');

const PORT = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient
const uri = process.env.MONGO_URL
const client = new MongoClient(uri)

app.set('port', 5000)
app.use(express.static(path.join(__dirname, '/client/build')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

client.connect()

// app.use('/api', router); 

mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false }); 
mongoose.connection.once('open', function() { 
  console.log('Connected to the Database.');
})
mongoose.connection.on('error', function(error) {
  console.log('Mongoose Connection Error : ' + error);
})

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

var genRandomString = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
          .toString('hex') /** convert to hexadecimal format */
          .slice(0,length);   /** return required number of characters */
}

var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
      salt:salt,
      passwordHash:value
  };
}

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
const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().alphanum().min(8).max(20).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  isVerified: Joi.string().required(),
  token: Joi.required(),
  dateCreated: Joi.required(),
  salt: Joi.string().required()
})

const passResetSchema = Joi.object({
  password: Joi.string().alphanum().min(8).max(20).required(),
  salt: Joi.string().required()
})

// basic register api, only takes in username and password
app.post('/register', async (req, res, next) =>
{
  var errordb = '';
  let verified = "false";
  var d = new Date();
  let newDate = getDate(d);
  const db = client.db()
  const {username, password, email, firstName, lastName} = req.body;

  var {passwordHash, salt} = saltHashPassword(password)

  const userCheck = await db.collection('User').findOne({username:username})
  if (userCheck) return res.status(400).send({msg: "The username you have entered is already associated with another account."})

  const emailCheck = await db.collection('User').findOne({email:email})
  if (emailCheck) return res.status(400).send({msg: "The email address you have entered is already associated with another account."})

  const token = crypto.randomBytes(16).toString('hex')
  // passing new user data to joi for validation before we send him off to boating school
  // after validation, we pull the ol' 1-2 switcheroo and swap the og password with the hashed password.
  var newUser = {dateCreated:newDate, username:username, password:password, salt:salt, email:email, firstName:firstName, lastName:lastName, isVerified:verified, token:token}
  const {error} = Joi.validate(newUser, registerSchema)
  var newUser = {dateCreated:newDate, username:username, password:passwordHash, salt:salt, email:email, firstName:firstName, lastName:lastName, isVerified:verified, token:token, recoveryMode:"false", stockArray:[], valueArray:[]}

  // joi error check
  if(error) return res.status(400).send(error.details[0].message)

  // try to add user into the database
  try
  {
    await db.collection('User').insertOne(newUser)

    for (let i = 0; i < 5; i++)
      await db.collection('User').updateOne({email:email},{$push : {valueArray:0.0} })
    
    var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } })
    var mailOptions = { from: 'michael.yeah@pm.me', to: email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: ' + process.env.BASE_URL + 'confirmation\/' + token + '\n' }
  }
  catch(e)
  {
    errordb = e.toString()
  }

  // WILL ERROR OUT WE HIT THE TRANSPORTER SEND MAIL ERROR.
  // WILL ATTEMPT TO SET AND SEND HEADERS TWICE 
  transporter.sendMail(mailOptions, function(err){
    if (err) { return res.status(500).send({msg: err.message, err:errordb}); }
    res.status(200).send('A verification email has been sent to ' + email + '.');
  })

})

app.post('/confirmation/:token', async(req,res,next) =>
{
  var error=''
  let db = client.db();
  const tokenCheck = await db.collection('User').find({token:req.params.token}).toArray();

  // account verification
  if (tokenCheck.length > 0 && tokenCheck[0].isVerified == "false")
  {
    let db = client.db()
    db.collection('User').updateOne({token:req.params.token},{ $set : {isVerified:"true", token:""} },);
    db.collection('User').updateOne({username:process.env.USER}, {$push: {"usersArray": {$each: [tokenCheck[0].email]}}});
  }
  else
    error = 'User with that token was not found || User has already been verified.'

  ret = {error:error}
  res.status(200).json(ret);
})

// make the token and it bounces back and forth between front end and api
// every time the user does an action we extend the time left on that token
// when they switch pages, talk to api, anything will extend the token.
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

      var token = jwt.sign({id:results[0]._id}, process.env.SECRET, { expiresIn: '30m' });
      // log time here
      // update token time here
      // log time of token
      // if token expired, err.message = 'jwt expired'. so set err = err.message
      jwt.verify(token, process.env.SECRET, function(err, decoded)
      {
        // if there is no error validating the token
        if (!isNull(err))
        {
          error = err.message;
        }
        // prints out expiration time in seconds since unix epoch
        console.log(decoded.exp);
      })
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
    
  var ret = {username:uname,email:email,firstName:fn,lastName:ln,id:id,error:error,jwt:token,recovery:recovery};
  res.status(200).json(ret); 
  // set session cookie for logout / activity
  // var ret = {userId:id, firstName:fn, lastName:ln, error:error};
})

// token validation => new token with expiration set to 30m
app.post('/api/validation', async(req, res, next) =>
{
  const {token} = req.body;
  var uId = '';
  var error = '';
  var newToken = '';

  jwt.verify(token, process.env.SECRET, function(err, decoded)
  {
    // if error, save error to send back to front end.
    if (!isNull(err))
    {
      error = err.message;
    }
    else if (isNull(err))
    {
      uId = decoded.id;
      newToken = jwt.sign({id:uId}, process.env.SECRET, { expiresIn: '30m' });
    }
  })

  var ret = {jwt:newToken,error:error};
  res.status(200).json(ret);
  // check the time remaining on the token to verify
  // if expired, ping back that this token is expired/useless
  // if time is left, we go ahead and reset the time left
})

// if a valid token is passed, makes a new token that expires in 1second
app.post('/api/logout', async(req, res, next) =>
{
  const {token} = req.body;
  var uId = '';
  var error = '';
  var newToken = '';

  jwt.verify(token, process.env.SECRET, function(err, decoded)
  {
    // if error, save error to send back to front end.
    if (!isNull(err))
    {
      if (err.message === "jwt expired")
        error = "You are already logged out."
      else
        error = err.message;
    }
    else if (isNull(err))
    {
      uId = decoded.id;
      newToken = jwt.sign({id:uId}, process.env.SECRET, { expiresIn: '1s' });
    }
  })

  var ret = {jwt:newToken,error:error};
  res.status(200).json(ret);
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
  var day = addZero(d.getUTCDate());

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
app.post('/api/addStock', async(req, res, next) => 
{
  var error = '';
  const {username, stock} = req.body;

  const db = client.db();
  const results = await db.collection('User').find({username:username}).toArray();

  if (results.length > 0)
  {
    var array = results[0].stockArray;
    var found = array.includes(stock)
    if (found)
      error = "Stock already exists on user profile."
    else if (!found)
    {
      let price = await fetchStock(stock);
      // stock was found 
      if(typeof price !== 'undefined')
        await client.db().collection('User').updateOne({"username":username},{ $push : {"stockArray":stock} },);
      // stock was not found
      else if (typeof price === 'undefined')
        error = "Invalid stock symbol."
    }
  }
  else
    error = "User does not exist"

  var ret = {error:error}
  res.status(200).json(ret);
})

// add stock ticker validation
app.post('/api/deleteStock', async (req, res, next) =>
{
  const {username, stock} = req.body
  var error = ''
  db = client.db()

  var results = await db.collection('User').find({username:username}).toArray()

  if (results.length <= 0) 
    error = "User not found."
  else
    await db.collection('User').updateOne({username:username}, {$pull: {'stockArray':stock}})
  
    // await db.collection('User').updateOne({"username":username},{ $push : {"stockArray":  {$each: [stock], $position: 0}} },);

  let ret = {error:error} 
  res.status(200).json(ret)
})

// takes in user email, looks for user in database
// if found: generates random password, hashes new password, stores it in database and sets recoveryMode to true on users document
// email the user their temporary password so they can login to change their password.
app.post('/api/forgot', async(req, res, next) =>
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
    res.status(200).send("A user with that email was not found.");

})

// PASSWORD CHANGE
app.post('/api/reset', async (req, res, next) => 
{
  // reset password via email and password field
  var newError = ''
  const {email, password} = req.body
  let db = client.db()
  var {passwordHash, salt} = saltHashPassword(password)
  var passCheck = {password:password, salt:salt}

  const {error} = Joi.validate(passCheck, passResetSchema)

  if(error) return res.status(400).json({error:error.details[0].message});

  const results = await db.collection('User').find({email:email}).toArray()

  if (results.length > 0)
    await client.db().collection('User').updateOne({email:email},{$set : {password:passwordHash, salt:salt} })
  else
    newError = "User with that email address was not found."

  let ret = {error:newError}
  res.status(200).json(ret)
})

// takes in username, email, firstName, lastName, id (id will be removed)
// don't allow them to change their email. validate that new username doesn't exist before changing
app.post('/api/updateAccount', async(req, res, next) => 
{
  // lookup new username in db.toArray
  // or update data first, then check username
  // if results.length > 0 update all other data
  // send error saying username already exists
  // else update everything & return blank error
  var error = ''
  const {username, email, firstName, lastName, id} = req.body
  
  let db = client.db()
  let results = await db.collection('User').find({email:email}).toArray()


  // if we want to change usernames we have to pass along the original username + new username.
  // if they are the same, we don't check to see if a user already holds the new username.
  // usernameRes = db.collection('User').find({username:username}).toArray()
  // if (usernameRes.length > 0)
  //   error = 'User with that username already exists'

  if (results.length > 0)
    await db.collection('User').updateOne({email:email},{$set : {firstName:firstName,lastName:lastName} },);
  else
    error = "User with that id was not found."

  ret = {error:error}
  res.status(200).json(ret)

})

// takes in a username to return the master date array, the users stock array, and the users value array
app.post('/api/getData', async (req, res, next) => {

  // returns:
  // master  datesArray
  // user    stockArray
  // user    valueArray

  const {username} = req.body
  var error = ''
  db = client.db()
  var dates = []
  var stonks = []
  var values = []

  let results = await db.collection('User').find({username:username}).toArray()
  let master = await db.collection('User').find({username:process.env.MASTERUSER}).toArray()

  if (results.length > 0)
  {
    // console.log(results[0])
    dates = master[0].datesArray
    stonks = results[0].stockArray
    values = results[0].valueArray
  }
  else
    error = "User does not exist."

  ret = {dates:dates,stocks:stonks,values:values,error:error}
  res.status(200).json(ret)

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
})