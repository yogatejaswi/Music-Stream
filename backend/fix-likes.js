// Quick script to fix likes field in songs collection
const mongoose = require('mongoose');
require('dotenv').config();

async function fixLikes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');

    // Update all songs where likes is an array to be a number
    const result = await songsCollection.updateMany(
      { likes: { $type: 'array' } },
      { $set: { likes: 0 } }
    );

    console.log(`Fixed ${result.modifiedCount} songs`);
    
    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixLikes();
