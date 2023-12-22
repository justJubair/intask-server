require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express")
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000

// middlewares
app.use(cors({
  origin: ["http://localhost:5173", "https://intask-client.vercel.app", "https://intask-client-cbsrvykf2-jubair-ahmeds-projects.vercel.app"]
}))
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
    // await client.connect();


    const tasksCollection = client.db("inTaskDB").collection("tasks")
    const onGoingTasksCollection = client.db("inTaskDB").collection("onGoingTasks")
    const completeTasksCollection = client.db("inTaskDB").collection("completeTasks")


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


    // GET; a on going task
    app.get("/onGoingTasks", async(req,res)=>{
      let query = {}
      if(req?.query?.userEmail){
          query = {userEmail: req?.query?.userEmail}
      }
      const result = await onGoingTasksCollection.find(query).toArray()
      res.send(result)
    })


    // POST; a task on going list
    app.post("/onGoingTasks", async(req,res)=>{
      const onGoingTask = req?.body;
      const result = await onGoingTasksCollection.insertOne(onGoingTask)
      res.send(result)
    })

    // DELETE; a ongoin task
    app.delete("/onGoingtasks/:id", async(req,res)=>{
      const id = req?.params?.id;
      const query = {_id: new ObjectId(id)}

      const result = await onGoingTasksCollection.deleteOne(query)
      res.send(result)
    })


    // GET; complete task based on user
    app.get("/completeTasks", async(req,res)=>{
      let query = {}
      if(req?.query?.userEmail){
          query = {userEmail: req?.query?.userEmail}
      }

      const result = await completeTasksCollection.find(query).toArray()
      res.send(result)
    })


    // POST; a task on complete list
    app.post("/completeTasks", async(req,res)=>{
      const completeTask = req?.body;
      const result = await completeTasksCollection.insertOne(completeTask)
      res.send(result)
    })

    // Delete; a complete task
    app.delete("/completeTasks/:id", async(req,res)=>{
      const id = req?.params?.id;
      const query = {_id: new ObjectId(id)}

      const result = await completeTasksCollection.deleteOne(query)
      res.send(result)
    })

    // Delete: a task
    app.delete("/tasks/:id", async(req,res)=>{
      const id = req?.params?.id;
      const query = {_id: new ObjectId(id)}

      const result = await tasksCollection.deleteOne(query)
      res.send(result)
    })



    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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

