const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res) => {
  // res.send('Hello');
  res.sendFile(__dirname + '/index.html');
});

client.connect(err => {
    const productCollection = client.db("OrganicDB").collection("products");
    

    app.post("/addProduct", (req,res) => {
      const collection = client.db("OrganicDB").collection("products");
      const db = client.db("OrganicDB");
      const product = req.body;
      console.log(product);
      db.collection('products').insertOne(product)
        .then((result) => {
          console.log('one product added');
         // res.send("Success");
         res.redirect('/');
        });
    });

    app.get("/products", (req,res) => {
      productCollection.find({})
      .toArray((err,documents) =>{
        res.send(documents);
      })
    });

    app.get('/product/:id', (req,res) => {
      
      productCollection.find({
        _id: objectId(req.params.id)})
        .toArray((err,documents) =>{
          res.send(documents[0]);
        })
    })

    app.patch('/update/:id', (req,res) => {
      productCollection.updateOne({
        _id: objectId(req.params.id)
      },
      { $set: {name: req.body.name }}
      )
      .then(result => {
        res.send(result.modifiedCount > 0);
        console.log(result);
       // res.redirect('/');
      // res.redirect(303, "/");
      })
    })
    
    app.delete('/delete/:id', (req,res) => {
      const collection = client.db("OrganicDB").collection("products");
      const db = client.db("OrganicDB");
      db.collection('products').deleteOne({
        _id: objectId(req.params.id)})
      .then(result => {
        console.log(result);
        res.send(result.deletedCount > 0);
        //res.redirect('/');
        // res.send(200)
        // req.method = 'GET'

        // res.redirect('/');
      // res.redirect(303, "/");
      
      })
     
    })
    // perform actions on the collection object
    console.log('db connected');
  //  client.close();
  });
  

app.listen(3000);