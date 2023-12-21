require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express")
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000

// middlewares
app.use(cors())
app.use(express.json())


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI, {
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


    const tasksCollection = client.db("inTaskDB").collection("tasks")


    // GET; all the user based tasks;
    app.get("/tasks", async(req,res)=>{
        let query = {}
        if(req?.query?.userEmail){
            query = {userEmail: req?.query?.userEmail}
        }
        const result = await tasksCollection.find(query).toArray()
        res.send(result)
    })

    // POST; a task
    app.post("/tasks", async(req,res)=>{
        const task = req?.body;
        const result = await tasksCollection.insertOne(task)
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


app.get("/", (req,res)=>{
    res.send("Intask is running on MongoDB")
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

