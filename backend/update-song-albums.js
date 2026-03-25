// Script to add album information to Telugu songs
const mongoose = require('mongoose');
require('dotenv').config();

async function updateSongAlbums() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');

    // Update songs with album information
    const updates = [
      {
        title: "Butta Bomma",
        album: "Ala Vaikunthapurramuloo",
        year: 2020
      },
      {
        title: "Ramuloo Ramulaa",
        album: "Ala Vaikunthapurramuloo",
        year: 2020
      },
      {
        title: "Samajavaragamana",
        album: "Ala Vaikunthapurramuloo",
        year: 2020
      },
      {
        title: "Inkem Inkem",
        album: "Geetha Govindam",
        year: 2018
      },
      {
        title: "Vachinde",
        album: "Fidaa",
        year: 2017
      }
    ];

    let updatedCount = 0;
    
    for (const update of updates) {
      const result = await songsCollection.updateOne(
        { title: update.title },
        { 
          $set: { 
            album: update.album,
            year: update.year,
            updatedAt: new Date() 
          } 
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated album for: ${update.title} -> ${update.album}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Song not found or already updated: ${update.title}`);
      }
    }

    console.log(`\n🎵 Successfully updated ${updatedCount} songs with album info!`);
    console.log('✅ Done! Songs are now organized by albums.');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateSongAlbums();
