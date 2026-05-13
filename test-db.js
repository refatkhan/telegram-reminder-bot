const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

async function testConnection() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('studyReminder');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    await client.close();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

testConnection();