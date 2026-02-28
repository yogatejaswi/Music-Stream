// Script to update Telugu artist images with real URLs
const mongoose = require('mongoose');
require('dotenv').config();

async function updateArtistImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const artistsCollection = db.collection('artists');

    // Update each artist with their real image URL
    const updates = [
      {
        name: "Sid Sriram",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7ykWDbSk8mznNdOu27fIm_gtcTwHd0J5ZQ&s"
      },
      {
        name: "Armaan Malik",
        image: "https://assets.teenvogue.com/photos/61e194b6192e956300d6d02b/4:3/w_4099,h_3074,c_limit/Armaan%20Malik%203.jpg"
      },
      {
        name: "Anurag Kulkarni",
        image: "https://i.scdn.co/image/ab676161000051749f6590e0cef7d0ac838966b0"
      },
      {
        name: "Madhu Priya",
        image: "https://c.saavncdn.com/artists/Madhu_Priya_002_20250207143023_500x500.jpg"
      },
      {
        name: "Javed Ali",
        image: "https://i.scdn.co/image/ab6761610000e5eb84e0829f8e8abff52255fbd3"
      },
      {
        name: "Mangli",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1TpzDHvyUxrZwHLEIi6-uJ_BQmizhE7MG_w&s"
      }
    ];

    let updatedCount = 0;
    for (const update of updates) {
      const result = await artistsCollection.updateOne(
        { name: update.name },
        { $set: { image: update.image, updatedAt: new Date() } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${update.name}`);
        updatedCount++;
      }
    }

    console.log(`\n🎤 Successfully updated ${updatedCount} artist images!`);
    console.log('✅ Done! Refresh your dashboard to see the updated images.');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateArtistImages();
