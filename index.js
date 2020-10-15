const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs-extra')
const fileUpload = require('express-fileUpload') 
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.huwqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('services'))
app.use(fileUpload())
const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
  const servicesCollection = client.db("CreativeAgency").collection("services");
  const reviewCollection = client.db("CreativeAgency").collection("review");
  
  app.post('/addServices',(req,res)=>{
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    const filePath = `${__dirname}/services/${file.name}`
    file.mv(filePath,err=>{
      if (err) {
        console.log(err);
      res.status(500).send({msg:'failed to upload'})
      }
      const newImg = fs.readFileSync(filePath)
      const encImg = newImg.toString('base64')

      var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

      servicesCollection.insertOne({title,description,image})
      .then(result=>{
        fs.remove(filePath,error=>{
          if(error){
            console.log(error)
            res.status(500).send({msg:'failed to upload'})
          }
          res.send(result.insertedCount>0)
        })
        console.log(result.insertedCount);
       
      })
    })
      // return res.send({name:file.name,path:`/${file.name}`})
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