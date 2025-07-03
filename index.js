require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lqn2pwg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const usersCollection = client.db("suggesto").collection("users");
    const queryCollection = client.db("suggesto").collection("queries");
    const recommendationCollection = client.db("suggesto").collection("recommendations");

    // user related apis
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      // console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    });

    // query related apis
    app.get("/queries", async (req, res) => {
      const result = await queryCollection.find().toArray();
      res.send(result);
    });

    app.get("/queries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await queryCollection.findOne(query);
      res.send(result);
    });

    app.get("/queries/user/:email", async (req, res) => {
        const email = req.params.userEmail;
        const query = { useremail: email };
        const result = await queryCollection.find(query).toArray();
        res.send(result);
    });

    app.post("/queries", async (req, res) => {
      const newQuery = req.body;
      const result = await queryCollection.insertOne(newQuery);
      res.send(result);
    })

    app.put("/queries/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedQuery = req.body;
      const updatedDoc = {
        $set: updatedQuery,
      };

      const result = await queryCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/queries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await queryCollection.deleteOne(query);
      res.send(result);
    });

    // recommendation related apis
    app.get("/recommendations", async (req, res) => {
      const result = await recommendationCollection.find().toArray();
      res.send(result);
    });

    app.get("/recommendations/query/:queryId", async (req, res) => {
      const queryId = req.params.queryId;
      const query = { queryId: queryId };
      const result = await recommendationCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/recommendations/recommender/:email", async (req, res) => {
      const email = req.params.email;
      const query = { recommenderEmail: email };
      const result = await recommendationCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/recommendations/user/:email", async (req, res) => {
      const userEmail = req.params.email;

      const userQueries = await queryCollection
        .find({ userEmail: userEmail })
        .toArray();

      const queryIds = userQueries.map((query) => query._id.toString());

      const recommendations = await recommendationCollection
        .find({
          queryId: { $in: queryIds },
        })
        .toArray();

      res.send(recommendations);
    });

    app.post("/recommendations", async (req, res) => {
      const newRecommendation = req.body;
      const [recommendationResult, queryUpdateResult] = await Promise.all([
        recommendationCollection.insertOne(newRecommendation),
        queryCollection.updateOne(
          { _id: new ObjectId(newRecommendation.queryId) },
          { $inc: { recommendationCount: 1 } }
        ),
      ]);

      res.send(recommendationResult);
    });

    app.delete("/recommendations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const recommendation = await recommendationCollection.findOne(query);
      const result = await recommendationCollection.deleteOne(query);
      await queryCollection.updateOne(
        { _id: new ObjectId(recommendation.queryId) },
        { $inc: { recommendationCount: -1 } }
      );
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello, Suggesto Server is running!");
});

app.listen(port, () => {
  console.log(`Suggesto Server is running on http://localhost:${port}`);
});
