const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2tc2nkt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        // ==================== COLLECTIONS ====================
        const foodsCollection = client.db('friendsKebab').collection('foodsCollection');
        const usersCollection = client.db('friendsKebab').collection('usersCollection');


        // ==================== FOODS ====================

        app.get('/foods', async (req, res) => {
            const foods = await foodsCollection.find({}).toArray();
            res.send(foods);
        })


        // ==================== USERS ====================

        app.get('/users', async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('friends kebab server');
});

app.listen(port, () => {
    console.log('listening to port', port);
});