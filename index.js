const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config();

const port = process.env.PORt || 5000


// midilewar

app.use(cors())
app.use(express.json())






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS}@cluster0.g50jtk2.mongodb.net/?retryWrites=true&w=majority`;



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

        const servicesCollection = client.db("carDoctor").collection("services");
        const bookingCollection = client.db("carDoctor").collection("booking");

        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/services/:id', async(req, res) => {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const options = {
                    projection: { title: 1, price: 1, img: 1 },
                };
                const result = await servicesCollection.findOne(query, options)
                res.send(result)
            })
            //  booking oparetion

        app.get('/booking', async(req, res) => {
            let query = {}
            if (req.query && req.query.email) {
                query = { email: req.query.email }
            }
            const cursor = await bookingCollection.find(query).toArray()
            res.send(cursor)

        })
        app.patch('/booking/:id', async(req, res) => {
            const id = req.params.id;
            const upDateBooking = req.body
            console.log(id);
            const filter = { _id: new ObjectId(id) }
            const upDate = {
                $set: {
                    oder: upDateBooking.oder
                }
            }
            const result = await bookingCollection.updateOne(filter, upDate)
            res.send(result)

        })



        app.delete('/booking/:id', async(req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.send(result)

        })
        app.post('/booking', async(req, res) => {
                const booking = req.body;
                const result = await bookingCollection.insertOne(booking)
                res.send(result)

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
        res.send('Hello World!')
    })
    // app.get('/data', (req, res) => {
    //     res.send(services)
    // })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})