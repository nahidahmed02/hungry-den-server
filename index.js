const express = require('express');
// const multer = require('multer');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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


//  Multer configuration for file upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// })

// const upload = multer({ storage });


async function run() {
    try {
        await client.connect();

        // ==================== COLLECTIONS ====================
        const profileCollection = client.db('friendsKebab').collection('profileCollection');
        const foodsCollection = client.db('friendsKebab').collection('foodsCollection');
        const usersCollection = client.db('friendsKebab').collection('usersCollection');
        const reviewsCollection = client.db('friendsKebab').collection('reviewsCollection');


        // ======================== JWT ========================

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN);
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        })


        // ==================== PROFILE ====================

        // to post the profile
        app.post('/profile', async (req, res) => {
            const profile = req.body;
            const result = await profileCollection.insertOne(profile);
            res.send(result);
        })

        // upload route
        // app.post('/upload', upload.single('photo'), async (req, res) => {
        //     try {
        //         if (!req.file) {
        //             return res.status(400).send({ message: 'No file uploaded' })
        //         }

        //         const email = req.params.email;
        //         const fileDetails = {
        //             email: email,
        //             filename: req.file.filename,
        //             originalname: req.file.originalname
        //         }

        //         const result = await profileCollection.insertOne(fileDetails);
        //         res.send(result);

        //     } catch (error) {
        //         console.error('file uploading error', error);
        //         res.status(500).send({ message: 'Internal server error' });
        //     }
        // })


        // ==================== FOODS ====================

        // to get all the foods
        app.get('/foods', async (req, res) => {
            const foods = await foodsCollection.find({}).toArray();
            res.send(foods);
        })

        // to delete a food
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await foodsCollection.deleteOne(query);
            res.send(result);
        })


        // ==================== USERS ====================

        // to get all the users
        app.get('/users', async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
        })

        // to store the user
        app.put('/users/:email', async (req, res) => {
            const user = req.body;
            const email = req.params.email;
            const query = { email };
            const updatedDoc = {
                $set: user
            };
            const options = { upsert: true };
            const result = await usersCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        })

        // to give user the admin role
        app.put('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const updatedDoc = {
                $set: { role: 'admin' }
            }
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        // to give user the delivery man role
        app.put('/users/dman/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const updatedDoc = {
                $set: { role: 'dman' }
            };
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        // to remove from admin role
        app.put('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const updatedDoc = {
                $set: { role: 'user' }
            };
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        // to remove from delivery man role
        app.put('/dman/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const updatedDoc = {
                $set: { role: 'user' }
            };
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        })


        // ==================== REVIEWS ====================

        // to get all the reviews
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })

        // to get a user's review
        app.get('/reviews/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await reviewsCollection.find(query).toArray();
            res.send(result);
        })

        // to add reviews in DB
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        // to delete a review
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
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