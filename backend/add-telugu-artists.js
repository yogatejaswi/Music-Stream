// Script to add Telugu artists to the database
const mongoose = require('mongoose');
require('dotenv').config();

async function addTeluguArtists() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const artistsCollection = db.collection('artists');

    // Check if artists already exist
    const existingCount = await artistsCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} artists already exist. Skipping...`);
      await mongoose.disconnect();
      return;
    }

    const teluguArtists = [
      {
        name: "Sid Sriram",
        bio: "Sid Sriram is an Indian-American playback singer, songwriter, and music producer. Known for his soulful voice in Telugu cinema.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7ykWDbSk8mznNdOu27fIm_gtcTwHd0J5ZQ&s",
        genre: "Playback Singer",
        verified: true,
        followers: 0,
        monthlyListeners: 0,
        socialLinks: {
          instagram: "https://instagram.com/sidsriram",
          twitter: "https://twitter.com/sidsriram",
          facebook: "https://facebook.com/sidsriram"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Armaan Malik",
        bio: "Armaan Malik is an Indian singer, songwriter, record producer, voice-over artist, and actor. Known for romantic melodies.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        genre: "Playback Singer",
        verified: true,
        followers: 0,
        monthlyListeners: 0,
        socialLinks: {
          instagram: "https://instagram.com/armaanmalik",
          twitter: "https://twitter.com/armaanmalik",
          facebook: "https://facebook.com/armaanmalik"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Anurag Kulkarni",
        bio: "Anurag Kulkarni is an Indian playback singer who predominantly works in Telugu cinema. Known for energetic folk songs.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        genre: "Folk Singer",
        verified: true,
        followers: 0,
        monthlyListeners: 0,
        socialLinks: {
          instagram: "https://instagram.com/anuragkulkarni",
          twitter: "https://twitter.com/anuragkulkarni"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Madhu Priya",
        bio: "Madhu Priya is an Indian playback singer who works predominantly in Telugu cinema. Known for folk and romantic songs.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        genre: "Folk Singer",
        verified: true,
        followers: 0,
        monthlyListeners: 0,
        socialLinks: {
          instagram: "https://instagram.com/madhupriya"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Javed Ali",
        bio: "Javed Ali is an Indian playback singer who has sung in many languages including Telugu. Known for soulful romantic songs.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        genre: "Playback Singer",
        verified: true,
        followers: 0,
        monthlyListeners: 0,
        socialLinks: {
          instagram: "https://instagram.com/javedali",
          twitter: "https://twitter.com/javedali"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Mangli",
        bio: "Mangli is an Indian playback singer and television presenter who works in Telugu cinema. Known for folk and mass songs.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        genre: "Folk Singer",
        verified: true,
        followers: 0,
        monthlyListeners: 0,
        socialLinks: {
          instagram: "https://instagram.com/mangli"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const result = await artistsCollection.insertMany(teluguArtists);
    console.log(`🎤 Successfully added ${result.insertedCount} Telugu artists!`);
    console.log('✅ Done! Refresh your dashboard to see the artists.');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTeluguArtists();
