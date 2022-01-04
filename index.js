const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqqvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("connection success")

        const database = client.db("softy-shop");
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('review');

        //post addProduct api
        app.post('/addProduct', async (req, res) => {
            const product = req.body
            const result = await productsCollection.insertOne(product);
            res.json(result);
        })
        //delete my Product api
        app.delete('/deleteProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);

            res.json(result)
        })
        // get all products api 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        //get api one Product by id
        app.get('/product/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const query = { id: id };
            const result = await productsCollection.findOne(query);

            res.send(result);

        })

        //get product by category
        app.get('/products/category/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category: category }
            const result = await productsCollection.find(query).toArray();

            res.send(result);
        })

        // get all user api 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();

            res.send(result);
        })
        // get user by email api 
        app.get('/user/:email', async (req, res) => {

            const email = req.params.email;
            const query = { email: email }
            const result = await usersCollection.find(query).toArray();

            res.send(result);
        })
        //post user api 
        app.post('/addUser', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


        //Order api 
        app.post('/addOrder', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })

        // get user by email api 
        app.get('/myOrder/:email', async (req, res) => {

            const email = req.params.email;
            const query = { email: email }
            const result = await orderCollection.find(query).toArray();

            res.send(result);
        })
        //get all order
        app.get('/allOrders', async (req, res) => {
            const query = {};
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })

        //delete my order api
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);

            res.json(result)
        })

        //update states api
        app.put('/updateStates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    orderStates: `Shipped`
                },
            };
            const result = await orderCollection.updateOne(query, updateDoc, options);
            console.log("heading shipped");

            res.json(result);
        })
        //update admin states api
        app.put('/updateAdmin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            console.log(query);
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    roll: "admin"
                },
            };
            const result = await usersCollection.updateOne(query, updateDoc, options);

            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Softy shop");
})

app.listen(port, () => {
    console.log("Listening port: ", port);
})