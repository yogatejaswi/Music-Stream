// Script to update song cover images
const mongoose = require('mongoose');
require('dotenv').config();

async function updateSongCovers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');

    const coverImageUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh7wyJ4OhVFPy2BTe0uGWAdocnLGMH-lKnHsd3SttWJuGZgVLBRBQ6UW3h9PyaV4s7n_gjlKdfhtfJMJdfiKKHovvNmznV-Qo3xu215YmNMozVO01Qr4J3mBXU3xxk4hfaoyQ-KYjYcZXA/s1600/1567265546408_FL+copy.jpg";

    const songsToUpdate = [
      "Butta Bomma",
      "Ramuloo Ramulaa",
      "Samajavaragamana"
    ];

    let updatedCount = 0;
    
    for (const songTitle of songsToUpdate) {
      const result = await songsCollection.updateOne(
        { title: songTitle },
        { $set: { coverImage: coverImageUrl, updatedAt: new Date() } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated cover for: ${songTitle}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Song not found: ${songTitle}`);
      }
    }

    console.log(`\n🎵 Successfully updated ${updatedCount} song covers!`);
    console.log('✅ Done! Refresh your dashboard to see the updated covers.');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateSongCovers();
