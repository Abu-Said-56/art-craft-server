const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.ARTCRAFT_ID}:${process.env.ARTCRAFT_PASSWORD}@cluster0.szzkw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        // Create collection for add Add Art and craft items
        const itemCollection = client.db('ArtCraft').collection('Item');

        // Create collectin for and user Informations
        const userCollection = client.db('ArtCraft').collection('User');


        // get operetion for get item on server side
        app.get('/all-item', async (req, res) => {
            const cursor = itemCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // using gate operations for update items
        app.get('/all-item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await itemCollection.findOne(query);
            res.send(result);
        })



        // Post operation for add items on server side
        app.post('/all-item', async (req, res) => {
            const newItem = req.body
            console.log("newItem: ", newItem)
            const result = await itemCollection.insertOne(newItem)
            res.send(result)
        })


        // Updated operations
        app.put('/all-item/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = {upsert: true }; 
            const updatedCraft = req.body;
            
            const Craft = {
                $set: {
                name : updatedCraft.name,
                quantity : updatedCraft.quantity,
                supplier : updatedCraft.supplier,
                taste : updatedCraft.taste,
                category : updatedCraft.category,
                details : updatedCraft.details,
                photo : updatedCraft.photo,
                }
            }
            const result = await itemCollection.updateOne(filter, Craft, options);
            res.send(result);
        })

        app.delete('/all-item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })




        // FOR USER RELATED FUNCTIONALITIES

        // apply get operations for read or show data on the display
        app.get('/users',async(req,res) => {
            const cursor = userCollection.find();
            const user = await cursor.toArray();
            res.send(user);
        })


        // post user informations into database server 
        app.post('/users',async(req,res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // use put operations for update user informations
        app.put('/users/:id', async(req, res) => {
            const user = req.params.id;
            const filter = { email : user.email}
            // const options = { upsert: true }
            // const userCollection = req.body
            const updateUser = {
                $set: {
                    lastLoggedAt: user.lastLoggedAt
                }
            }
            const result = await userCollection.updateOne(filter, updateUser);
            res.send(result);
        })

        // Delete operations for user informations
        app.delete('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Art and craft server is running')
})

app.listen(port, () => {
    console.log(`Art and Craft Server is running on port: ${port}`)
})