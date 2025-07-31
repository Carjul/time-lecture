const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv')

dotenv.config()
const uri = process.env.URI ;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);
const connectDB = async () => {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const db = client.db("time_lectura");
const collection = db.collection("Lecturas");

module.exports = { connectDB, collection, client };