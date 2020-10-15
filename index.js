const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.huwqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors())
const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
  const servicesCollection = client.db("CreativeAgency").collection("services");
  const reviewCollection = client.db("CreativeAgency").collection("review");
  
  app.post('/addServices',(req,res)=>{
    const services = req.body;
    console.log(services);
    servicesCollection.insertOne(services)
    .then(result=>{
      console.log(result.insertedCount);
      res.send(result.insertedCount>0)
    })
  })


  app.get('/service', (req, res) => {
    servicesCollection.find({})
    .toArray( (err, documents) => {
      console.log(documents,err);
        res.send(documents);
    })
  })



  app.post('/addReview',(req,res)=>{
    const review = req.body;
    console.log(review);
    reviewCollection.insertOne(review)
    .then(result=>{
      console.log(result.insertedCount);
      res.send(result.insertedCount>0)
    })
  })

  app.get('/review', (req, res) => {
    reviewCollection.find({})
    .toArray( (err, documents) => {
      console.log(documents,err);
        res.send(documents);
    })
  })


});




app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(process.env.PORT || port)