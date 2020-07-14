const cron = require("node-cron");
const mongoose = require('mongoose')
const { IEXCloudClient } = require('node-iex-cloud')
const fetch = require('node-fetch')
require('dotenv').config()
const PORT = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient
const uri = process.env.MONGO_URL
const client = new MongoClient(uri)

const masterUser = process.env.MASTERUSER 

const iex = new IEXCloudClient(fetch, {
    sandbox: true,
    publishable: process.env.STONK_TOK,
    version: "stable"
  })

client.connect()

mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false }); 
mongoose.connection.once('open', function() { 
  console.log('Connected to the Database.');
})
mongoose.connection.on('error', function(error) {
  console.log('Mongoose Connection Error : ' + error);
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

// VALUE ARRAY
//  0   1   2   3   4
// 123 123 123 123 123 

// DATE ARRAY
// MON  TUES  WED  THU  FRI
//  0     1    2    3    4
// 1/20 1/21 1/22 1/23 1/24

// new user starts on wednesday[2]:
// for i < dayOfWeek -> 
// 
// 

// *****************************
// USER 2

// VALUE ARRAY
//  0   1   2   3   4
//  0   0  123 123 123 

// MASTER DATE ARRAY
// MON  TUES  WED  THU  FRI
//  0     1    2    3    4
// 1/20 1/21 1/22 1/23 1/24

// returns 0 if it's a monday, 1 if tuesday, etc.
function currDay()
{
  var d = new Date()
  return (d.getDay()-1)
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
  var day = addZero(d.getUTCDate());

  // Month: 1 = Jan, 2 = Feb, 3 = March, 4 = April, etc.
  var month = addZero(d.getUTCMonth() + 1);  
  var year = d.getUTCFullYear();
  newDate =  month + "/" + day + "/" + year;
  return newDate;
}

async function fetchStock(stock)
{
  return iex.symbol(stock.toString()).price();
}

cron.schedule("00 00 16 * * 1-5", async function() {
    var userArray = []
    var stocks = []
    var d = new Date()
    let dayOfWeek = currDay()
    let currDate = getDate(d)
    let db = client.db();
    let results = await db.collection('User').find({username:masterUser}).toArray()

    userArray = results[0].usersArray
    dateArray = results[0].datesArray
    let dLength = dateArray.length

    while (dLength > 4)
    {
      await db.collection('User').updateOne( { username:masterUser }, { $pop: { datesArray: -1 } } )
      dLength--
    }

    await db.collection('User').updateOne( { username:masterUser }, { $push: { datesArray:currDate } } )
    
    // get current date & time, store it here
    
    for (let i = 0; i < userArray.length; i++)
    {
        let totalPrice = 0;
        let results2 = await db.collection('User').find({email:userArray[i]}).toArray()

        stocks = results2[0].stockArray;
        values = results2[0].valueArray;
        let vLength = values.length

        for (let j = 0; j < stocks.length; j++)
        {
            let currPrice = await fetchStock(stocks[j]);
            totalPrice += currPrice
            console.log(totalPrice)
        }

        while (vLength > 4)
        {
          await db.collection('User').updateOne( { email:userArray[i] }, { $pop: { valueArray: -1 } } )
          vLength--
        }

        await db.collection('User').updateOne({email:userArray[i]}, { $push: {"valueArray":totalPrice}});

    }

});
