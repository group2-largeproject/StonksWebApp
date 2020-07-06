const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const mongoose = require('mongoose');

// const cors = require('cors');
const router = require('./routes/index');

const PORT = process.env.PORT || 5000; 
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Jason_Rod:pEyQefCge8UuYH0l@cop4331-7exdq.mongodb.net/COP4331?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });


app.use(express.static(path.join(__dirname, '/client/build')))

client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// app.use(cors())
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use('/api', router); 

mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false }); 
mongoose.connection.once('open', function() { 
  console.log('Connected to the Database.');
});
mongoose.connection.on('error', function(error) {
  console.log('Mongoose Connection Error : ' + error);
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

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

app.listen(PORT, function() { 
  console.log(`Server listening on port ${PORT}.`);
});