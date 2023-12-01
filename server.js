const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://urmil:kBYScQIQq34FwcNH@cluster0.usks0w0.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');

// ...

app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://urmil:kBYScQIQq34FwcNH@cluster0.usks0w0.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Define routes here (Create, Read, Update, Delete)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Add these lines to your server.js file

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// CRUD routes

// Create
app.post('/items', (req, res) => {
  const newItem = new Item(req.body);
  newItem.save()
    .then(item => {
      res.json(item);
    })
    .catch(err => {
      res.status(400).send('Unable to save item to database');
    });
});

// Read
// Read
app.get('/items', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (error) {
      res.status(500).send('Error retrieving items from database');
    }
  });
  

// Update
app.put('/items/:id', (req, res) => {
  Item.findById(req.params.id, (err, item) => {
    if (!item)
      res.status(404).send('Data is not found');
    else {
      item.name = req.body.name;
      item.description = req.body.description;

      item.save()
        .then(item => {
          res.json('Item updated');
        })
        .catch(err => {
          res.status(400).send('Update not possible');
        });
    }
  });
});

// Delete
app.delete('/items/:id', (req, res) => {
  Item.findByIdAndRemove(req.params.id, (err, item) => {
    if (err) res.json(err);
    else res.json('Item deleted');
  });
});
