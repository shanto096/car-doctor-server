const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")
require("dotenv").config();

const port = process.env.PORt || 5000


// midilewar

app.use(cors())
app.use(express.json())



// jwt function
// const verifyToken = (req, res, next) => {
// console.log('verify');
// console.log(req.headers.authorization);
// const authorization = req.headers.authorization;
// console.log("hsjjs" + authorization);
// // if (!authorization) {
//     return res.send({ error: true, message: "unauthorized" })

// }
// const token = authorization.split(' ')[1];
// console.log(token);
// jwt.verify(token, process.env.WEB_TOKEN, (error, decoded) => {
//     if (error) {
//         return res.status(404).send({ error: true, message: 'unauthorized' })

//     }
//     res.decoded = decoded;
//     next()
// })

// }


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

        // jwt

        // app.post('/jwt', (req, res) => {
        //     const user = req.body;
        //     console.log(user);
        //     const token = jwt.sign(user, process.env.WEB_TOKEN, { expiresIn: '1h' })
        //     res.send({ token })
        // })




        //   ################ services data
        // all services data
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // single services data

        app.get('/services/:id', async(req, res) => {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const options = {
                    projection: { title: 1, price: 1, img: 1 },
                };
                const result = await servicesCollection.findOne(query, options)
                res.send(result)
            })
            // #####################  booking oparetion

        app.get('/booking', async(req, res) => {
            // console.log(req.headers.authorization);
            // const decoded = res.decoded;
            // console.log('d' + decoded);
            // if (decoded.email !== req.body.email) {
            //     return res.status(403).send({ error: true, message: 'fribon ' })

            // }
            // console.log(req.headers.authorization.token);
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