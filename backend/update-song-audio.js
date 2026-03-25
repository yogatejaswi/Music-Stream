// Script to update song audio URLs
const mongoose = require('mongoose');
require('dotenv').config();

async function updateSongAudio() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');

    // Update songs with audio URLs
    // You can use:
    // 1. Soundcloud URLs
    // 2. Your own hosted files
    // 3. Free audio hosting services
    
    const updates = [
      {
        title: "Butta Bomma",
        audioUrl: "https://res.cloudinary.com/dwig4kohm/video/upload/v1774418233/Buttabomma_-_SenSongsMp3.Co_cws8id.mp3", // e.g. https://res.cloudinary.com/dwig4kohm/video/upload/Buttabomma.mp3
        duration: 245
      },
      {
        title: "Ramuloo Ramulaa",
        audioUrl: "https://res.cloudinary.com/dwig4kohm/video/upload/v1774418380/Ramuloo_Ramula_-_SenSongsMp3.Co_zln9qg.mp3",
        duration: 240
      },
      {
        title: "Samajavaragamana",
        audioUrl: "https://res.cloudinary.com/dwig4kohm/video/upload/v1774418414/Samajavaragamana_-_SenSongsMp3.Co_rkdaz2.mp3",
        duration: 238
      },
      {
        title: "Inkem Inkem",
        audioUrl: "https://res.cloudinary.com/dwig4kohm/video/upload/v1774419094/Inkem_Inkem_Inkem_Kaavaale_-_SenSongsMp3.Co_awhxwt.mp3",
        duration: 252
      },
      {
        title: "Vachinde",
        audioUrl: "https://res.cloudinary.com/dwig4kohm/video/upload/v1774419154/Vachinde-SenSongsMp3.Co_izt41l.mp3",
        duration: 230
      }
    ];

    let updatedCount = 0;
    
    for (const update of updates) {
      const result = await songsCollection.updateOne(
        { title: update.title },
        { 
          $set: { 
            audioUrl: update.audioUrl,
            duration: update.duration,
            updatedAt: new Date() 
          } 
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated audio for: ${update.title}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Song not found: ${update.title}`);
      }
    }

    console.log(`\n🎵 Successfully updated ${updatedCount} songs with audio!`);
    console.log('✅ Done! Songs are now playable.');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateSongAudio();
