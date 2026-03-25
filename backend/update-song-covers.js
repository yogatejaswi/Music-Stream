// Script to update song cover images
const mongoose = require('mongoose');
require('dotenv').config();

async function updateSongCovers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');

    // Song cover updates
    const updates = [
      {
        title: "Butta Bomma",
        coverImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh7wyJ4OhVFPy2BTe0uGWAdocnLGMH-lKnHsd3SttWJuGZgVLBRBQ6UW3h9PyaV4s7n_gjlKdfhtfJMJdfiKKHovvNmznV-Qo3xu215YmNMozVO01Qr4J3mBXU3xxk4hfaoyQ-KYjYcZXA/s1600/1567265546408_FL+copy.jpg"
      },
      {
        title: "Ramuloo Ramulaa",
        coverImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh7wyJ4OhVFPy2BTe0uGWAdocnLGMH-lKnHsd3SttWJuGZgVLBRBQ6UW3h9PyaV4s7n_gjlKdfhtfJMJdfiKKHovvNmznV-Qo3xu215YmNMozVO01Qr4J3mBXU3xxk4hfaoyQ-KYjYcZXA/s1600/1567265546408_FL+copy.jpg"
      },
      {
        title: "Samajavaragamana",
        coverImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh7wyJ4OhVFPy2BTe0uGWAdocnLGMH-lKnHsd3SttWJuGZgVLBRBQ6UW3h9PyaV4s7n_gjlKdfhtfJMJdfiKKHovvNmznV-Qo3xu215YmNMozVO01Qr4J3mBXU3xxk4hfaoyQ-KYjYcZXA/s1600/1567265546408_FL+copy.jpg"
      },
      {
        title: "Inkem Inkem",
        coverImage: "https://talesntunes.wordpress.com/wp-content/uploads/2018/08/vijay-devarakonda-rashmika-mandanna-geetha-govindam-first-look-poster-hd.jpg?w=840"
      },
      {
        title: "Vachinde",
        coverImage: "https://m.media-amazon.com/images/S/pv-target-images/da2c8e10a113baf0aa1a13717894aa37a735e43c093930edb0a3615d3add1df3.jpg"
      }
    ];

    let updatedCount = 0;
    
    for (const update of updates) {
      const result = await songsCollection.updateOne(
        { title: update.title },
        { $set: { coverImage: update.coverImage, updatedAt: new Date() } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated cover for: ${update.title}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Song not found or already updated: ${update.title}`);
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
