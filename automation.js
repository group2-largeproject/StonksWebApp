const cron = require("node-cron");
const mongoose = require('mongoose')
const { IEXCloudClient } = require('node-iex-cloud')
const fetch = require('node-fetch')
require('dotenv').config()
const PORT = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient
const uri = process.env.MONGO_URL
const client = new MongoClient(uri)

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

async function fetchStock(stock)
{
  return iex.symbol(stock.toString()).price();
}


cron.schedule("15 28 22 * * 1-7", async function() {
    var userArray = []
    var stocks = []
    let db = client.db();
    let results = await db.collection('User').find({username:"master"}).toArray()

    userArray = results[0].usersArray
    
    // get current date & time, store it here
    
    for (let i = 0; i < userArray.length; i++)
    {
        let totalPrice = 0;
        let results2 = await db.collection('User').find({email:userArray[i]}).toArray()
        stocks = results2[0].stockArray;
        console.log(stocks)
        for (let j = 0; j < stocks.length; j++)
        {
            let currPrice = await fetchStock(stocks[j]);
            totalPrice += currPrice
            console.log(totalPrice)
        }
        // if results2.length > (5 days), pop the front of the array & push new totalPrice to the back
        await db.collection('User').updateOne({email:userArray[i]}, { $push: {"valueArray":totalPrice}});
    }    

});