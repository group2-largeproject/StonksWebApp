const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client/public')))


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
    res.sendFile(path.join(__dirname + '/client/public/index.html'))
});

app.listen(process.env.PORT || 5000); // start Node + Express server on port 5000
